const {
    Plugin,
    PluginSettingTab,
    Setting,
    MarkdownView,
    Platform
} = require('obsidian');

const DEFAULT_SETTINGS = {
    horizontalPos: 'left',
    verticalPos: 'middle',
    alignment: 'left',
    showBackground: false,
    bgOpacity: 10,
    bgColor: '',
    barStyle: 'solid-horizontal',
    barLength: 1.0,
    barThickness: 1,
    dotSize: 3,
    uniformSize: false,
    itemSpacing: 6,
    enableTooltip: true,
    useMonochrome: true,
    hiddenHeadings: '',

    h1Color: '#7aa5c2',
    h2Color: '#8fb89f',
    h3Color: '#c69c6d',
    h4Color: '#a390b2',
    h5Color: '#bc7e89',
    h6Color: '#749895',

    h1ColorLight: '#4a7592',
    h2ColorLight: '#4f785f',
    h3ColorLight: '#966c3d',
    h4ColorLight: '#736082',
    h5ColorLight: '#8c4e59',
    h6ColorLight: '#446865'
};

class InkFloatingTOCPlugin extends Plugin {
    async onload() {
        if (Platform.isPhone) {
            console.log('Ink Floating TOC disabled on phones');
            return;
        }

        this.tooltipTimeout = null;
        this.activeTooltip = null;
        this.lastClickedLine = null;

        await this.loadSettings();
        this.addSettingTab(new InkTOCSettingTab(this.app, this));
        this.injectCSS();

        this.registerDomEvent(document, 'pointerdown', (e) => {
            if (!e.target.closest('.ink-toc-container')) {
                document.querySelectorAll('.ink-toc-item.is-active').forEach(el => {
                    if (el.dataset.activeType !== 'ctrl') {
                        el.classList.remove('is-active');
                        el.removeAttribute('data-active-type');
                    }
                });
            }
        });

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', () => this.refreshTOC())
        );

        this.registerEvent(
            this.app.workspace.on('file-open', () => this.refreshTOC())
        );

        this.registerEvent(
            this.app.workspace.on('layout-change', () => this.refreshTOC())
        );

        this.registerEvent(
            this.app.metadataCache.on('changed', () => this.refreshTOC())
        );

        this.app.workspace.onLayoutReady(() => {
            setTimeout(() => this.refreshTOC(), 100);
        });
    }

    onunload() {
        this.hideTooltip();
        this.removeCSS();
        this.removeTOC();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.updateCSSVariables();
        this.refreshTOC();
    }

    removeTOC() {
        this.hideTooltip();
        const existing = document.querySelectorAll('.ink-toc-container');
        existing.forEach(el => el.remove());

        document.querySelectorAll('.ink-toc-active-left, .ink-toc-active-right').forEach(el => {
            el.classList.remove('ink-toc-active-left', 'ink-toc-active-right');
        });
    }

    showTooltip(item, text, color, position) {
        this.hideTooltip();

        this.tooltipTimeout = setTimeout(() => {
            const tooltip = document.createElement('div');
            tooltip.classList.add('ink-toc-global-tooltip', position);

            const finalTooltipColor = this.settings.useMonochrome ? 'var(--text-normal)' : color;
            tooltip.style.setProperty('--tooltip-color', finalTooltipColor);

            const textSpan = document.createElement('span');
            textSpan.innerText = text;
            tooltip.appendChild(textSpan);

            document.body.appendChild(tooltip);
            this.activeTooltip = tooltip;

            const rect = item.getBoundingClientRect();
            const offset = this.settings.showBackground ? 24 : 14;

            tooltip.style.top = `${rect.top + (rect.height / 2)}px`;

            if (position === 'left') {
                tooltip.style.right = `${window.innerWidth - rect.left + offset}px`;
            } else {
                tooltip.style.left = `${rect.right + offset}px`;
            }

            requestAnimationFrame(() => {
                tooltip.classList.add('is-visible');
            });
        }, 100);
    }

    hideTooltip() {
        if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
        if (this.activeTooltip) {
            const tt = this.activeTooltip;
            tt.classList.remove('is-visible');
            setTimeout(() => {
                if (tt.parentNode) tt.remove();
            }, 150);
            this.activeTooltip = null;
        }
    }

    refreshTOC() {
        const leaf = this.app.workspace.activeLeaf || this.app.workspace.getMostRecentLeaf();

        if (!leaf || !leaf.view) {
            this.removeTOC();
            return;
        }

        const view = leaf.view;
        const viewType = view.getViewType();

        if (viewType !== 'markdown' && viewType !== 'empty') {
            return;
        }

        const oldFoldStates = new Map();
        const existingContainer = document.querySelector('.ink-toc-container');
        if (existingContainer) {
            existingContainer.querySelectorAll('.ink-toc-item').forEach(el => {
                if (el.dataset.activeType === 'ctrl' && el.dataset.headingText) {
                    oldFoldStates.set(el.dataset.headingText, true);
                }
            });
        }

        this.removeTOC();

        const file = view.file;
        let headings = [];

        if (file && viewType === 'markdown') {
            const cache = this.app.metadataCache.getFileCache(file);
            headings = cache?.headings || [];
        }

        if (this.settings.hiddenHeadings && headings.length > 0) {
            const hiddenLevels = new Set(this.settings.hiddenHeadings.match(/\d/g)?.map(Number) || []);
            headings = headings.filter(h => !hiddenLevels.has(h.level));
        }

        const tooltipPos = this.settings.horizontalPos === 'right' ? 'left' : 'right';

        const container = document.createElement('div');
        container.classList.add(
            'ink-toc-container',
            `pos-h-${this.settings.horizontalPos}`,
            `pos-v-${this.settings.verticalPos}`,
            `active-style-${this.settings.barStyle}`,
            `align-${this.settings.alignment}`
        );

        if (viewType === 'empty') {
            container.classList.add('is-empty-tab');
        }

        if (this.settings.uniformSize) {
            container.classList.add('uniform-size');
        }

        if (this.settings.showBackground) {
            container.classList.add('has-background');
        }

        const rootEl = view.contentEl || view.containerEl;
        rootEl.classList.add(`ink-toc-active-${this.settings.horizontalPos}`);

        const scrollUp = document.createElement('div');
        scrollUp.classList.add('ink-toc-scroll-indicator', 'ink-toc-scroll-up');

        const scrollDown = document.createElement('div');
        scrollDown.classList.add('ink-toc-scroll-indicator', 'ink-toc-scroll-down');

        const list = document.createElement('div');
        list.classList.add('ink-toc-list');

        let folds = [];
        try {
            if (this.app.foldManager && view.file) {
                const foldData = this.app.foldManager.load(view.file);
                if (foldData && foldData.folds) {
                    folds = foldData.folds;
                }
            }
        } catch(e) {}

        if (headings.length === 0) {
            const item = document.createElement('div');
            item.classList.add('ink-toc-item', `style-${this.settings.barStyle}`, 'toc-empty-state');
            item.setAttribute('data-level', '1');
            item.dataset.level = "1";
            item.style.setProperty('--item-color', 'var(--text-muted)');

            const bar = document.createElement('div');
            bar.classList.add('ink-toc-bar');

            const indicator = document.createElement('div');
            indicator.classList.add('ink-toc-indicator');

            item.appendChild(bar);
            item.appendChild(indicator);

            if (this.settings.enableTooltip) {
                const tooltipText = file ? "No headings available" : "No note open";
                item.addEventListener('mouseenter', () => {
                    const color = item.style.getPropertyValue('--item-color') || 'var(--text-muted)';
                    this.showTooltip(item, tooltipText, color, tooltipPos);
                });
                item.addEventListener('mouseleave', () => this.hideTooltip());
            }

            list.appendChild(item);
        } else {
            headings.forEach((heading, index) => {
                const item = document.createElement('div');
                item.classList.add('ink-toc-item', `style-${this.settings.barStyle}`);
                item.setAttribute('data-level', heading.level.toString());
                item.dataset.level = heading.level;
                item.dataset.line = heading.position.start.line;
                item.dataset.index = index;

                const headingText = heading.heading.replace(/[[\]#*_`~=<>]/g, '').trim();
                item.dataset.headingText = headingText;

                let isFoldedInNote = false;
                let foldManagerSaysFolded = false;

                if (folds && folds.length > 0) {
                    foldManagerSaysFolded = folds.some(f => {
                        const foldLine = typeof f.from === 'number' ? f.from : (typeof f[0] === 'number' ? f[0] : null);
                        return foldLine === heading.position.start.line;
                    });
                }

                if (this.lastClickedLine && this.lastClickedLine.line === heading.position.start.line.toString() && (Date.now() - this.lastClickedLine.time < 2000)) {
                    isFoldedInNote = (this.lastClickedLine.type === 'ctrl');
                } else if (foldManagerSaysFolded) {
                    isFoldedInNote = true;
                } else if (oldFoldStates.has(headingText)) {
                    isFoldedInNote = true;
                }

                if (isFoldedInNote) {
                    item.classList.add('is-active');
                    item.dataset.activeType = 'ctrl';
                }

                const colorValue = this.settings.useMonochrome
                    ? 'var(--text-muted)'
                    : `var(--toc-h${heading.level}-color)`;

                item.style.setProperty('--item-color', colorValue);

                const bar = document.createElement('div');
                bar.classList.add('ink-toc-bar');

                const indicator = document.createElement('div');
                indicator.classList.add('ink-toc-indicator');

                item.appendChild(bar);
                item.appendChild(indicator);

                if (this.settings.enableTooltip) {
                    item.addEventListener('mouseenter', () => {
                        const color = item.style.getPropertyValue('--item-color') || 'var(--text-normal)';
                        this.showTooltip(item, headingText, color, tooltipPos);
                    });
                    item.addEventListener('mouseleave', () => this.hideTooltip());
                }

                item.addEventListener('pointerup', (e) => this.handleItemClick(e, view, item, list));
                list.appendChild(item);
            });
        }

        container.appendChild(scrollUp);
        container.appendChild(list);
        container.appendChild(scrollDown);

        const sView = rootEl.querySelector('.markdown-source-view');
        const rView = rootEl.querySelector('.markdown-reading-view');

        if (sView) {
            sView.insertAdjacentElement('beforebegin', container);
        } else if (rView) {
            rView.insertAdjacentElement('beforebegin', container);
        } else {
            rootEl.appendChild(container);
        }

        const updateScrollIndicators = () => {
            const { scrollTop, scrollHeight, clientHeight } = list;

            const isScrollable = scrollHeight > (clientHeight + 15);

            if (isScrollable && scrollTop > 5) {
                scrollUp.classList.add('is-visible');
            } else {
                scrollUp.classList.remove('is-visible');
            }

            const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

            if (isScrollable && distanceToBottom > 15) {
                scrollDown.classList.add('is-visible');
            } else {
                scrollDown.classList.remove('is-visible');
            }

            if (isScrollable) {
                list.style.overflowY = 'auto';
            } else {
                list.style.overflowY = 'hidden';
                if (scrollTop > 0) list.scrollTop = 0;
            }
        };

        list.addEventListener('scroll', () => {
            this.hideTooltip();
            updateScrollIndicators();
        });

        const resizeObserver = new ResizeObserver(() => {
            this.hideTooltip();
            updateScrollIndicators();
        });
        resizeObserver.observe(container);

        setTimeout(updateScrollIndicators, 50);
    }

    alignHeadingToItem(view, line, item) {
        requestAnimationFrame(() => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.top + (itemRect.height / 2);

            if (view.currentMode && view.currentMode.type === 'preview') {
                const scroller = view.contentEl.querySelector('.markdown-preview-view');
                const el = view.contentEl.querySelector(`[data-line="${line}"]`);

                if (scroller && el) {
                    const elRect = el.getBoundingClientRect();
                    const elCenter = elRect.top + (elRect.height / 2);
                    scroller.scrollBy({ top: elCenter - itemCenter, behavior: 'smooth' });
                }
            } else {
                const scroller = view.contentEl.querySelector('.cm-scroller');
                if (scroller) {
                    const el = scroller.querySelector('.cm-active');
                    if (el) {
                        const elRect = el.getBoundingClientRect();
                        const elCenter = elRect.top + (elRect.height / 2);
                        scroller.scrollBy({ top: elCenter - itemCenter, behavior: 'smooth' });
                    }
                }
            }
        });
    }

    setActiveState(list, item, type) {
        const allItems = list.querySelectorAll('.ink-toc-item');
        allItems.forEach(i => {
            if (i !== item && i.dataset.activeType === 'ctrl') {
                return;
            }
            i.classList.remove('is-active');
            i.removeAttribute('data-active-type');
        });
        item.classList.add('is-active');
        item.dataset.activeType = type;
    }

    handleItemClick(e, view, item, list) {
        e.preventDefault();
        e.stopPropagation();
        this.hideTooltip();

        const line = parseInt(item.dataset.line);
        const lineStr = line.toString();
        const delay = e.pointerType === 'mouse' ? 150 : 300;

        if (!this.clickCount) this.clickCount = 0;
        if (this.clickTimer) clearTimeout(this.clickTimer);

        this.clickCount++;

        let isActuallyFolded = item.dataset.activeType === 'ctrl';

        if (view.contentEl) {
            const lineEl = view.contentEl.querySelector(`[data-line="${line}"]`);
            if (lineEl) {
                isActuallyFolded = !!(lineEl.querySelector('.cm-foldPlaceholder') ||
                                      lineEl.closest('.is-collapsed') ||
                                      lineEl.classList.contains('is-collapsed') ||
                                      lineEl.closest('[data-collapsed="true"]'));
            }
        }

        try {
            if (this.app.foldManager && view.file) {
                const foldData = this.app.foldManager.load(view.file);
                if (foldData && foldData.folds) {
                    const dbFolded = foldData.folds.some(f => {
                        const foldLine = typeof f.from === 'number' ? f.from : (typeof f[0] === 'number' ? f[0] : null);
                        return foldLine === line;
                    });
                    if (dbFolded) isActuallyFolded = true;
                }
            }
        } catch(e) {}

        const isCurrentlyCtrl = isActuallyFolded;

        if (this.clickCount >= 2) {
            const nextType = isCurrentlyCtrl ? 'standard' : 'ctrl';
            this.lastClickedLine = { line: lineStr, type: nextType, time: Date.now() };
            this.setActiveState(list, item, nextType);
            this.executeCtrlClick(view, line, item);
            this.clickCount = 0;
            return;
        }

        this.clickTimer = setTimeout(() => {
            if (this.clickCount === 1) {
                if (e.pointerType === 'mouse' && (e.ctrlKey || e.metaKey)) {
                    const nextType = isCurrentlyCtrl ? 'standard' : 'ctrl';
                    this.lastClickedLine = { line: lineStr, type: nextType, time: Date.now() };
                    this.setActiveState(list, item, nextType);
                    this.executeCtrlClick(view, line, item);
                } else {
                    const expectedType = isCurrentlyCtrl ? 'ctrl' : 'standard';
                    this.lastClickedLine = { line: lineStr, type: expectedType, time: Date.now() };
                    this.setActiveState(list, item, expectedType);
                    this.executeStandardClick(view, line, item);
                }
            }
            this.clickCount = 0;
        }, delay);
    }

    executeCtrlClick(view, line, item) {
        view.leaf.openFile(view.file, { eState: { line: line } });

        if (view.editor) {
            view.editor.focus();
            view.editor.setCursor({ line: line, ch: 0 });
        }

        this.app.commands.executeCommandById('editor:toggle-fold');

        if (document.activeElement) {
            document.activeElement.blur();
        }

        this.alignHeadingToItem(view, line, item);
    }

    executeStandardClick(view, line, item) {
        view.leaf.openFile(view.file, { eState: { line: line } });

        if (view.editor) {
            view.editor.setCursor({ line: line, ch: 0 });
        }

        if (document.activeElement) {
            document.activeElement.blur();
        }

        this.alignHeadingToItem(view, line, item);
    }

    injectCSS() {
        this.removeCSS();

        const style = document.createElement('style');
        style.id = 'ink-toc-styles';
        style.textContent = `
            body {
                --toc-h1-color: var(--toc-h1-color-dark);
                --toc-h2-color: var(--toc-h2-color-dark);
                --toc-h3-color: var(--toc-h3-color-dark);
                --toc-h4-color: var(--toc-h4-color-dark);
                --toc-h5-color: var(--toc-h5-color-dark);
                --toc-h6-color: var(--toc-h6-color-dark);
            }

            body.theme-light {
                --toc-h1-color: var(--toc-h1-color-light);
                --toc-h2-color: var(--toc-h2-color-light);
                --toc-h3-color: var(--toc-h3-color-light);
                --toc-h4-color: var(--toc-h4-color-light);
                --toc-h5-color: var(--toc-h5-color-light);
                --toc-h6-color: var(--toc-h6-color-light);
            }

            .ink-toc-container {
                position: absolute;
                z-index: 100;
                pointer-events: none;
                display: flex;
                flex-direction: column;

                --toc-offset-d: 44px;
                max-height: calc(75% + 33px);
            }

            .ink-toc-container.pos-h-left { left: 20px; right: auto; }
            .ink-toc-container.pos-h-right { right: 20px; left: auto; }

            .ink-toc-container.pos-v-top {
                top: calc(12.5% - (0.875 * var(--toc-offset-d)));
            }

            .ink-toc-container.pos-v-middle {
                top: calc(50% - (var(--toc-offset-d) / 2));
                transform: translateY(-50%);
            }

            .ink-toc-container.pos-v-bottom {
                bottom: calc(12.5% + (0.125 * var(--toc-offset-d)));
            }

            .ink-toc-list {
                display: flex;
                flex-direction: column;
                gap: max(4px, var(--toc-item-spacing, 6px));
                pointer-events: auto;

                padding: 0 20px;
                margin: 0 -20px;

                max-height: 100%;
                overflow-y: auto;
                overscroll-behavior: contain;
                scrollbar-width: none;

                touch-action: pan-y;
                -webkit-user-select: none;
                user-select: none;
            }

            .ink-toc-container.align-left .ink-toc-list { align-items: flex-start; }
            .ink-toc-container.align-middle .ink-toc-list { align-items: center; }
            .ink-toc-container.align-right .ink-toc-list { align-items: flex-end; }

            .ink-toc-list::-webkit-scrollbar {
                display: none;
            }

            .ink-toc-container.pos-h-right .ink-toc-list { align-items: flex-end; }
            .ink-toc-container.pos-h-right.align-left .ink-toc-list { align-items: flex-start; }
            .ink-toc-container.pos-h-right.align-middle .ink-toc-list { align-items: center; }
            .ink-toc-container.pos-h-right.align-right .ink-toc-list { align-items: flex-end; }

            .ink-toc-item {
                display: flex;
                align-items: center;
                cursor: pointer;
                position: relative;
                opacity: 0.6;
                transition: opacity 0.2s, transform 0.2s;
                flex-shrink: 0;
            }

            .theme-light .ink-toc-item {
                opacity: 0.8;
            }

            .ink-toc-container.pos-h-right .ink-toc-item {
                flex-direction: row-reverse;
            }

            .ink-toc-item:hover, .theme-light .ink-toc-item:hover {
                opacity: 1;
            }

            .ink-toc-item.is-active {
                opacity: 1;
            }

            .ink-toc-indicator {
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50px;
                background-color: var(--item-color);
                opacity: 0;
                transition: opacity 0.2s, background-color 0.2s, box-shadow 0.2s, transform 0.2s;

                top: 50%;
                transform: translateY(-50%);
            }

            .ink-toc-container.pos-h-left .ink-toc-indicator {
                left: auto;
                right: calc(100% + 12px);
            }
            .ink-toc-container.pos-h-right .ink-toc-indicator {
                right: auto;
                left: calc(100% + 12px);
            }

            .ink-toc-item.is-active .ink-toc-indicator {
                opacity: 1;
                background-color: var(--item-color);
                border-radius: 50%;
                width: 4px;
                height: 4px;
                -webkit-mask-image: none;
                mask-image: none;
                box-shadow: none !important;
            }

            .ink-toc-item.toc-empty-state {
                opacity: 0.3;
                cursor: default;
                --item-level: 1 !important;
            }

            .ink-toc-item.toc-empty-state:hover { opacity: 0.5; }

            .ink-toc-global-tooltip {
                position: fixed;
                padding: 4px 10px;
                font-size: var(--font-ui-smaller);
                font-weight: 500;
                line-height: 1.3;
                border-radius: 50px;
                white-space: nowrap;
                pointer-events: none;
                z-index: 999999;
                color: var(--tooltip-color);

                opacity: 0;
                visibility: hidden;
                transition: opacity 0.15s cubic-bezier(0.2, 0, 0.2, 1), transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), visibility 0s linear 0.15s;

                background-color: color-mix(in srgb, var(--tooltip-color) 10%, var(--background-primary));
                border: 1px solid color-mix(in srgb, var(--tooltip-color) 25%, transparent);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
            }

            .ink-toc-global-tooltip.left {
                transform: translateY(-50%) translateX(8px);
            }

            .ink-toc-global-tooltip.right {
                transform: translateY(-50%) translateX(-8px);
            }

            .ink-toc-global-tooltip.is-visible.left,
            .ink-toc-global-tooltip.is-visible.right {
                opacity: 1;
                visibility: visible;
                transform: translateY(-50%) translateX(0);
                transition: opacity 0.15s cubic-bezier(0.2, 0, 0.2, 1), transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), visibility 0s linear 0s;
            }

            .ink-toc-item.style-solid-horizontal .ink-toc-bar {
                height: var(--toc-thickness, 2px);
                width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50px;
                transition: background-color 0.2s, box-shadow 0.2s;
            }

            .ink-toc-item.style-hollow-horizontal .ink-toc-bar {
                height: var(--toc-thickness, 2px);
                width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                border: 1px solid var(--item-color);
                border-radius: 50px;
                background: transparent;
                box-sizing: border-box;
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .ink-toc-item.style-solid-vertical .ink-toc-bar {
                width: var(--toc-thickness, 2px);
                height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50px;
                transition: background-color 0.2s, box-shadow 0.2s;
            }

            .ink-toc-item.style-hollow-vertical .ink-toc-bar {
                width: var(--toc-thickness, 2px);
                height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                border: 1px solid var(--item-color);
                border-radius: 50px;
                background: transparent;
                box-sizing: border-box;
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .ink-toc-item.style-solid-dot .ink-toc-bar {
                width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                height: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                min-width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50%;
                transition: background-color 0.2s, box-shadow 0.2s;
            }

            .ink-toc-item.style-hollow-dot .ink-toc-bar {
                width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                height: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                min-width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                border: 1.5px solid var(--item-color);
                border-radius: 50%;
                background: transparent;
                box-sizing: border-box;
                transition: border-color 0.2s, box-shadow 0.2s;
            }

            .ink-toc-item[data-level="1"] { --item-level: 1; }
            .ink-toc-item[data-level="2"] { --item-level: 1.2; }
            .ink-toc-item[data-level="3"] { --item-level: 1.5; }
            .ink-toc-item[data-level="4"] { --item-level: 1.8; }
            .ink-toc-item[data-level="5"] { --item-level: 2.2; }
            .ink-toc-item[data-level="6"] { --item-level: 2.8; }

            .ink-toc-container.uniform-size .ink-toc-item[data-level] {
                --item-level: 1 !important;
            }

            .ink-toc-scroll-indicator {
                width: 12px;
                height: 12px;
                background-color: var(--text-normal);
                opacity: 0;
                transition: opacity 0.3s ease-out;
                flex-shrink: 0;
                pointer-events: none;
                margin: 6px 0;

                -webkit-mask-size: contain;
                -webkit-mask-repeat: no-repeat;
                -webkit-mask-position: center;
                mask-size: contain;
                mask-repeat: no-repeat;
                mask-position: center;
            }

            .ink-toc-scroll-up {
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.0127728,7.94 C15.1422065,7.94 17.7938641,9.56308339 22.6194031,14.4800713 L22.6432919,14.4800713 C23.1688457,15.0051865 23.0255128,15.4109574 22.5238479,15.7928593 C21.9027389,16.1747613 21.4727404,16.1508924 20.8038538,15.6973838 C17.6027536,12.9285945 15.4049834,11.9977085 12.0366616,11.9977085 C8.64445103,11.9977085 6.42279199,12.9285945 3.22169185,15.6973838 C2.55280526,16.1508924 2.12280673,16.1747613 1.50169775,15.7928593 C1.00003281,15.4109574 0.785033544,15.0051865 1.40614253,14.4800713 C6.23168153,9.56308339 8.8833391,7.94 12.0127728,7.94 Z' fill='currentColor' fill-rule='nonzero'/%3E%3C/svg%3E");
                mask-image: url("data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.0127728,7.94 C15.1422065,7.94 17.7938641,9.56308339 22.6194031,14.4800713 L22.6432919,14.4800713 C23.1688457,15.0051865 23.0255128,15.4109574 22.5238479,15.7928593 C21.9027389,16.1747613 21.4727404,16.1508924 20.8038538,15.6973838 C17.6027536,12.9285945 15.4049834,11.9977085 12.0366616,11.9977085 C8.64445103,11.9977085 6.42279199,12.9285945 3.22169185,15.6973838 C2.55280526,16.1508924 2.12280673,16.1747613 1.50169775,15.7928593 C1.00003281,15.4109574 0.785033544,15.0051865 1.40614253,14.4800713 C6.23168153,9.56308339 8.8833391,7.94 12.0127728,7.94 Z' fill='currentColor' fill-rule='nonzero'/%3E%3C/svg%3E");
                transform: none;
            }

            .ink-toc-scroll-down {
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.0127728,7.94 C15.1422065,7.94 17.7938641,9.56308339 22.6194031,14.4800713 L22.6432919,14.4800713 C23.1688457,15.0051865 23.0255128,15.4109574 22.5238479,15.7928593 C21.9027389,16.1747613 21.4727404,16.1508924 20.8038538,15.6973838 C17.6027536,12.9285945 15.4049834,11.9977085 12.0366616,11.9977085 C8.64445103,11.9977085 6.42279199,12.9285945 3.22169185,15.6973838 C2.55280526,16.1508924 2.12280673,16.1747613 1.50169775,15.7928593 C1.00003281,15.4109574 0.785033544,15.0051865 1.40614253,14.4800713 C6.23168153,9.56308339 8.8833391,7.94 12.0127728,7.94 Z' fill='currentColor' fill-rule='nonzero'/%3E%3C/svg%3E");
                mask-image: url("data:image/svg+xml,%3Csvg width='24px' height='24px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12.0127728,7.94 C15.1422065,7.94 17.7938641,9.56308339 22.6194031,14.4800713 L22.6432919,14.4800713 C23.1688457,15.0051865 23.0255128,15.4109574 22.5238479,15.7928593 C21.9027389,16.1747613 21.4727404,16.1508924 20.8038538,15.6973838 C17.6027536,12.9285945 15.4049834,11.9977085 12.0366616,11.9977085 C8.64445103,11.9977085 6.42279199,12.9285945 3.22169185,15.6973838 C2.55280526,16.1508924 2.12280673,16.1747613 1.50169775,15.7928593 C1.00003281,15.4109574 0.785033544,15.0051865 1.40614253,14.4800713 C6.23168153,9.56308339 8.8833391,7.94 12.0127728,7.94 Z' fill='currentColor' fill-rule='nonzero'/%3E%3C/svg%3E");
                transform: rotate(180deg);
            }

            .ink-toc-scroll-indicator.is-visible {
                opacity: 0.4;
            }

            .theme-light .ink-toc-scroll-indicator.is-visible {
                opacity: 0.6;
            }

            .ink-toc-container.pos-h-left .ink-toc-scroll-indicator {
                align-self: flex-start;
                margin-left: calc((var(--toc-thickness, 2px) / 2) - 6px);
            }

            .ink-toc-container.pos-h-right .ink-toc-scroll-indicator {
                align-self: flex-end;
                margin-right: calc((var(--toc-thickness, 2px) / 2) - 6px);
            }

            .ink-toc-container.active-style-solid-dot.pos-h-left .ink-toc-scroll-indicator,
            .ink-toc-container.active-style-hollow-dot.pos-h-left .ink-toc-scroll-indicator {
                margin-left: calc((var(--toc-dot-size, 8px) / 2) - 6px);
            }

            .ink-toc-container.active-style-solid-dot.pos-h-right .ink-toc-scroll-indicator,
            .ink-toc-container.active-style-hollow-dot.pos-h-right .ink-toc-scroll-indicator {
                margin-right: calc((var(--toc-dot-size, 8px) / 2) - 6px);
            }

            .ink-toc-container.has-background {
                border-radius: 50px;
                padding: 8px 0;
                background-color: color-mix(in srgb, var(--toc-bg-color) var(--toc-bg-opacity-percent), transparent);
                border: 1px solid color-mix(in srgb, var(--text-normal) 15%, transparent);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
            }
            .ink-toc-container.active-style-solid-horizontal.has-background,
            .ink-toc-container.active-style-hollow-horizontal.has-background {
                border-radius: 12px;
            }
            .ink-toc-container.has-background .ink-toc-list {
                padding: 0 22px;
                margin: 0 -14px;
            }

            .ink-toc-container.has-background .ink-toc-scroll-indicator {
                align-self: center !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
            }

            .ink-toc-container.has-background .ink-toc-scroll-up {
                margin: -6px 0 6px 0 !important;
            }
            .ink-toc-container.has-background .ink-toc-scroll-down {
                margin: 6px 0 -6px 0 !important;
            }

            .ink-toc-active-left .markdown-source-view:not(.is-readable-line-width) .cm-scroller,
            .ink-toc-active-left .markdown-reading-view:not(.is-readable-line-width) .markdown-preview-view {
                padding-left: var(--toc-overlap-padding, 80px) !important;
            }

            .ink-toc-active-right .markdown-source-view:not(.is-readable-line-width) .cm-scroller,
            .ink-toc-active-right .markdown-reading-view:not(.is-readable-line-width) .markdown-preview-view {
                padding-right: var(--toc-overlap-padding, 80px) !important;
            }

            @media (pointer: coarse) {
                .ink-toc-item::after {
                    content: '';
                    position: absolute;
                    top: -8px;
                    bottom: -8px;
                    left: -8px;
                    right: -8px;
                    z-index: 1;
                }

                .ink-toc-list {
                    gap: max(14px, var(--toc-item-spacing, 6px)) !important;
                }

                .ink-toc-item.style-solid-horizontal .ink-toc-bar,
                .ink-toc-item.style-hollow-horizontal .ink-toc-bar {
                    height: calc(var(--toc-thickness, 2px) + 3px) !important;
                }

                .ink-toc-item.style-solid-vertical .ink-toc-bar,
                .ink-toc-item.style-hollow-vertical .ink-toc-bar {
                    width: calc(var(--toc-thickness, 2px) + 3px) !important;
                }

                .ink-toc-item.style-solid-dot .ink-toc-bar,
                .ink-toc-item.style-hollow-dot .ink-toc-bar {
                    width: calc((var(--toc-dot-size, 8px) + 6px) / var(--item-level, 1)) !important;
                    height: calc((var(--toc-dot-size, 8px) + 6px) / var(--item-level, 1)) !important;
                    min-width: calc((var(--toc-dot-size, 8px) + 6px) / var(--item-level, 1)) !important;
                }
            }
        `;
        document.head.appendChild(style);
        this.updateCSSVariables();
    }

    updateCSSVariables() {
        document.body.style.setProperty('--toc-length', this.settings.barLength);

        const mappedThickness = this.settings.barThickness + 2;
        document.body.style.setProperty('--toc-thickness', `${mappedThickness}px`);

        const mappedDotSize = this.settings.dotSize + 5;
        document.body.style.setProperty('--toc-dot-size', `${mappedDotSize}px`);

        document.body.style.setProperty('--toc-item-spacing', `${this.settings.itemSpacing}px`);

        document.body.style.setProperty('--toc-bg-opacity-percent', `${this.settings.bgOpacity}%`);

        const effectiveBgColor = this.settings.bgColor ? this.settings.bgColor : 'var(--background-secondary)';
        document.body.style.setProperty('--toc-bg-color', effectiveBgColor);

        for (let i = 1; i <= 6; i++) {
            document.body.style.setProperty(`--toc-h${i}-color-dark`, this.settings[`h${i}Color`]);
            document.body.style.setProperty(`--toc-h${i}-color-light`, this.settings[`h${i}ColorLight`]);
        }

        const isHorizontal = this.settings.barStyle.includes('horizontal');
        const paddingValue = isHorizontal ? `calc(60px + (24px * ${this.settings.barLength}))` : '80px';
        document.body.style.setProperty('--toc-overlap-padding', paddingValue);
    }

    removeCSS() {
        const style = document.getElementById('ink-toc-styles');
        if (style) style.remove();
    }
}

class InkTOCSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Ink Floating TOC Settings' });

        new Setting(containerEl)
            .setName('Horizontal Position')
            .addDropdown(drop => drop
                .addOption('left', 'Left')
                .addOption('right', 'Right')
                .setValue(this.plugin.settings.horizontalPos)
                .onChange(async (value) => {
                    this.plugin.settings.horizontalPos = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Vertical Position')
            .addDropdown(drop => drop
                .addOption('top', 'Top')
                .addOption('middle', 'Middle')
                .addOption('bottom', 'Bottom')
                .setValue(this.plugin.settings.verticalPos)
                .onChange(async (value) => {
                    this.plugin.settings.verticalPos = value;
                    await this.plugin.saveSettings();
                }));

        const isHorizontalStyle = this.plugin.settings.barStyle.includes('horizontal');
        const isDotStyle = this.plugin.settings.barStyle.includes('dot');

        if (isHorizontalStyle || isDotStyle) {
            new Setting(containerEl)
                .setName('Item Alignment')
                .setDesc('Align items to the left, middle, or right within the container.')
                .addDropdown(drop => drop
                    .addOption('left', 'Left')
                    .addOption('middle', 'Middle')
                    .addOption('right', 'Right')
                    .setValue(this.plugin.settings.alignment)
                    .onChange(async (value) => {
                        this.plugin.settings.alignment = value;
                        await this.plugin.saveSettings();
                    }));
        }

        containerEl.createEl('br');

        new Setting(containerEl)
            .setName('Bar Style')
            .addDropdown(drop => drop
                .addOption('solid-horizontal', 'Solid Horizontal')
                .addOption('hollow-horizontal', 'Hollow Horizontal')
                .addOption('solid-vertical', 'Solid Vertical')
                .addOption('hollow-vertical', 'Hollow Vertical')
                .addOption('solid-dot', 'Solid Dot')
                .addOption('hollow-dot', 'Hollow Dot')
                .setValue(this.plugin.settings.barStyle)
                .onChange(async (value) => {
                    this.plugin.settings.barStyle = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (isDotStyle) {
            new Setting(containerEl)
                .setName('Dot Size')
                .setDesc('Adjust the base diameter of the dots (Scale 1-5).')
                .addSlider(slider => slider
                    .setLimits(1, 5, 1)
                    .setValue(this.plugin.settings.dotSize)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.dotSize = value;
                        await this.plugin.saveSettings();
                    }));
        } else {
            new Setting(containerEl)
                .setName('Bar Length')
                .addSlider(slider => slider
                    .setLimits(1.0, 2.0, 0.1)
                    .setValue(this.plugin.settings.barLength)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.barLength = value;
                        await this.plugin.saveSettings();
                    }));

            new Setting(containerEl)
                .setName('Bar Thickness')
                .setDesc('Adjust the thickness of the bars (Scale 1-3).')
                .addSlider(slider => slider
                    .setLimits(1, 3, 1)
                    .setValue(this.plugin.settings.barThickness)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.barThickness = value;
                        await this.plugin.saveSettings();
                    }));
        }

        new Setting(containerEl)
            .setName('Uniform Item Size')
            .setDesc('When enabled, all bars and dots will be identical in size regardless of heading level. When disabled, they scale down from H1 to H6.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.uniformSize)
                .onChange(async (value) => {
                    this.plugin.settings.uniformSize = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Item Spacing')
            .setDesc('Adjust the vertical space between individual bars or dots (minimum 4px).')
            .addSlider(slider => slider
                .setLimits(4, 20, 1)
                .setValue(this.plugin.settings.itemSpacing)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.itemSpacing = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Monochrome Bar')
            .setDesc('Use native text colors for a clean look that adapts to Light/Dark mode automatically.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useMonochrome)
                .onChange(async (value) => {
                    this.plugin.settings.useMonochrome = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (!this.plugin.settings.useMonochrome) {
            containerEl.createEl('br');
            containerEl.createEl('h3', { text: 'Heading Colors' });
            containerEl.createEl('p', { text: 'Set specific item colors. The left picker applies to Dark Mode, the right picker applies to Light Mode.', cls: 'setting-item-description' });

            for (let i = 1; i <= 6; i++) {
                const keyDark = `h${i}Color`;
                const keyLight = `h${i}ColorLight`;

                new Setting(containerEl)
                    .setName(`H${i} Colors`)
                    .setDesc(`Left: Dark | Right: Light`)
                    .addColorPicker(color => color
                        .setValue(this.plugin.settings[keyDark])
                        .onChange(async (value) => {
                            this.plugin.settings[keyDark] = value;
                            await this.plugin.saveSettings();
                        }))
                    .addColorPicker(color => color
                        .setValue(this.plugin.settings[keyLight])
                        .onChange(async (value) => {
                            this.plugin.settings[keyLight] = value;
                            await this.plugin.saveSettings();
                        }))
                    .addExtraButton(button => button
                        .setIcon('rotate-ccw')
                        .setTooltip('Reset to default colors')
                        .onClick(async () => {
                            this.plugin.settings[keyDark] = DEFAULT_SETTINGS[keyDark];
                            this.plugin.settings[keyLight] = DEFAULT_SETTINGS[keyLight];
                            await this.plugin.saveSettings();
                            this.display();
                        })
                    );
            }
        }

        containerEl.createEl('br');

        new Setting(containerEl)
            .setName('TOC Background')
            .setDesc('Display a rounded solid background container behind the TOC.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showBackground)
                .onChange(async (value) => {
                    this.plugin.settings.showBackground = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.showBackground) {
            new Setting(containerEl)
                .setName('TOC Background Opacity')
                .setDesc('Adjust the transparency of the background track (0 = perfectly transparent).')
                .addSlider(slider => slider
                    .setLimits(0, 100, 1)
                    .setValue(this.plugin.settings.bgOpacity)
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.bgOpacity = value;
                        await this.plugin.saveSettings();
                    }));

            const colorSetting = new Setting(containerEl)
                .setName('TOC Background Color')
                .setDesc('Select the base color for the solid background track. Click reset to restore the adaptive theme default.')
                .addColorPicker(color => color
                    .setValue(this.plugin.settings.bgColor || '#000000')
                    .onChange(async (value) => {
                        this.plugin.settings.bgColor = value;
                        await this.plugin.saveSettings();
                    }));

            colorSetting.addExtraButton(button => button
                .setIcon('rotate-ccw')
                .setTooltip('Reset to adaptive theme default')
                .onClick(async () => {
                    this.plugin.settings.bgColor = '';
                    await this.plugin.saveSettings();
                    this.display();
                })
            );
        }

        containerEl.createEl('br');

        new Setting(containerEl)
            .setName('Hide Specific Headings')
            .setDesc('Enter heading levels to hide, separated by commas (e.g. h3, h4).')
            .addText(text => text
                .setPlaceholder('e.g. h3, h4')
                .setValue(this.plugin.settings.hiddenHeadings)
                .onChange(async (value) => {
                    this.plugin.settings.hiddenHeadings = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Enable Tooltip')
            .setDesc('Show heading name when hovering over the bar')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableTooltip)
                .onChange(async (value) => {
                    this.plugin.settings.enableTooltip = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        containerEl.createEl('br');
        containerEl.createEl('hr');
        containerEl.createEl('br');

        const supportDiv = containerEl.createDiv();
        supportDiv.style.textAlign = 'center';
        supportDiv.style.marginTop = '20px';
        supportDiv.style.marginBottom = '20px';

        supportDiv.createEl('p', {
            text: 'If you enjoy using Ink Floating TOC, consider supporting its development! ☕️',
            attr: { style: 'margin-bottom: 15px; opacity: 0.8;' }
        });

        const kofiLink = supportDiv.createEl('a', {
            href: 'https://ko-fi.com/jayantakumardas'
        });

        const kofiImg = kofiLink.createEl('img', {
            attr: {
                src: 'https://ko-fi.com/img/githubbutton_sm.svg',
                alt: 'Support me on Ko-fi'
            }
        });
        kofiImg.style.height = '36px';
    }
}

module.exports = InkFloatingTOCPlugin;
