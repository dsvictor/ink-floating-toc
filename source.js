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
    bgStyle: 'glass',
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
    h6Color: '#749895'
};

class InkFloatingTOCPlugin extends Plugin {
    async onload() {
        if (Platform.isPhone) {
            console.log('Ink Floating TOC disabled on phones');
            return;
        }

        await this.loadSettings();
        this.addSettingTab(new InkTOCSettingTab(this.app, this));
        this.injectCSS();

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', () => this.refreshTOC())
        );

        this.registerEvent(
            this.app.metadataCache.on('changed', () => this.refreshTOC())
        );

        this.app.workspace.onLayoutReady(() => this.refreshTOC());
    }

    onunload() {
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
        const existing = document.querySelectorAll('.ink-toc-container');
        existing.forEach(el => el.remove());

        document.querySelectorAll('.ink-toc-active-left, .ink-toc-active-right').forEach(el => {
            el.classList.remove('ink-toc-active-left', 'ink-toc-active-right');
        });
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
            container.classList.add('has-background', `bg-style-${this.settings.bgStyle}`);
        }

        const rootEl = view.contentEl || view.containerEl;
        rootEl.classList.add(`ink-toc-active-${this.settings.horizontalPos}`);

        const scrollUp = document.createElement('div');
        scrollUp.classList.add('ink-toc-scroll-indicator', 'ink-toc-scroll-up');

        const scrollDown = document.createElement('div');
        scrollDown.classList.add('ink-toc-scroll-indicator', 'ink-toc-scroll-down');

        const list = document.createElement('div');
        list.classList.add('ink-toc-list');

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

            const anchor = document.createElement('div');
            anchor.classList.add('ink-toc-tooltip-anchor');

            if (this.settings.enableTooltip) {
                const tooltipText = file ? "No headings available" : "No note open";
                anchor.setAttribute("aria-label", tooltipText);
                anchor.setAttribute("data-tooltip-position", tooltipPos);
                anchor.setAttribute("aria-label-position", tooltipPos);
            }

            item.appendChild(bar);
            item.appendChild(indicator);
            item.appendChild(anchor);
            list.appendChild(item);
        } else {
            headings.forEach((heading, index) => {
                const item = document.createElement('div');
                item.classList.add('ink-toc-item', `style-${this.settings.barStyle}`);
                item.setAttribute('data-level', heading.level.toString());
                item.dataset.level = heading.level;
                item.dataset.line = heading.position.start.line;
                item.dataset.index = index;
                item.dataset.collapsed = "false";

                const colorValue = this.settings.useMonochrome
                    ? 'var(--text-muted)'
                    : (this.settings[`h${heading.level}Color`] || '#fff');

                item.style.setProperty('--item-color', colorValue);

                const bar = document.createElement('div');
                bar.classList.add('ink-toc-bar');

                const indicator = document.createElement('div');
                indicator.classList.add('ink-toc-indicator');

                const anchor = document.createElement('div');
                anchor.classList.add('ink-toc-tooltip-anchor');

                if (this.settings.enableTooltip) {
                    const cleanText = heading.heading.replace(/[[\]#*_`~=<>]/g, '').trim();
                    anchor.setAttribute("aria-label", cleanText);
                    anchor.setAttribute("data-tooltip-position", tooltipPos);
                    anchor.setAttribute("aria-label-position", tooltipPos);
                }

                item.appendChild(bar);
                item.appendChild(indicator);
                item.appendChild(anchor);

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

        list.addEventListener('scroll', updateScrollIndicators);

        const resizeObserver = new ResizeObserver(() => updateScrollIndicators());
        resizeObserver.observe(container);

        setTimeout(updateScrollIndicators, 50);
    }

    handleItemClick(e, view, item, list) {
        e.preventDefault();
        e.stopPropagation();

        const line = parseInt(item.dataset.line);

        if (e.pointerType === 'mouse') {
            if (e.altKey) {
                this.executeAltClick(item, line);
            } else if (e.ctrlKey || e.metaKey) {
                this.executeCtrlClick(view, line);
            } else {
                this.executeStandardClick(view, line);
            }
            return;
        }

        if (!this.clickCount) this.clickCount = 0;
        this.clickCount++;

        if (this.clickTimer) clearTimeout(this.clickTimer);

        this.clickTimer = setTimeout(() => {
            const count = this.clickCount;
            this.clickCount = 0;

            if (count >= 3) {
                this.executeAltClick(item, line);
            } else if (count === 2) {
                this.executeCtrlClick(view, line);
            } else {
                this.executeStandardClick(view, line);
            }
        }, 300);
    }

    executeAltClick(item, line) {
        const currentLevel = parseInt(item.dataset.level);
        const nextItem = item.nextElementSibling;

        if (!nextItem || parseInt(nextItem.dataset.level) <= currentLevel) {
            return;
        }

        const isCollapsed = item.dataset.collapsed === "true";
        item.dataset.collapsed = isCollapsed ? "false" : "true";

        let sibling = nextItem;
        while (sibling) {
            const siblingLevel = parseInt(sibling.dataset.level);
            if (siblingLevel <= currentLevel) break;

            if (isCollapsed) {
                sibling.style.display = 'flex';
            } else {
                sibling.style.display = 'none';
                sibling.dataset.collapsed = "false";
            }
            sibling = sibling.nextElementSibling;
        }
    }

    executeCtrlClick(view, line) {
        view.leaf.openFile(view.file, { eState: { line: line } });

        view.editor.focus();
        view.editor.setCursor({ line: line, ch: 0 });

        setTimeout(() => {
            this.app.commands.executeCommandById('editor:toggle-fold');

            if (document.activeElement) {
                document.activeElement.blur();
            }
        }, 50);
    }

    executeStandardClick(view, line) {
        view.leaf.openFile(view.file, { eState: { line: line } });

        if (document.activeElement) {
            document.activeElement.blur();
        }
    }

    injectCSS() {
        this.removeCSS();

        const style = document.createElement('style');
        style.id = 'ink-toc-styles';
        style.textContent = `
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

            .ink-toc-container.pos-h-right .ink-toc-list {
                align-items: flex-end;
            }

            .ink-toc-container.pos-h-right.align-left .ink-toc-list { align-items: flex-start; }
            .ink-toc-container.pos-h-right.align-middle .ink-toc-list { align-items: center; }
            .ink-toc-container.pos-h-right.align-right .ink-toc-list { align-items: flex-end; }

            .ink-toc-item {
                display: flex;
                align-items: center;
                cursor: pointer;
                position: relative;
                opacity: 0.6;
                transition: opacity 0.2s;
                flex-shrink: 0;
            }

            .ink-toc-tooltip-anchor {
                position: absolute;
                inset: -4px -12px;
                z-index: 10;
            }

            .ink-toc-container.pos-h-right .ink-toc-item {
                flex-direction: row-reverse;
            }

            .ink-toc-item:hover { opacity: 1; }

            .ink-toc-item.toc-empty-state {
                opacity: 0.3;
                cursor: default;
                --item-level: 1 !important;
            }

            .ink-toc-item.toc-empty-state:hover { opacity: 0.5; }

            .ink-toc-indicator {
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50px;
                background-color: var(--item-color);
                opacity: 0;
                transition: opacity 0.2s;

                top: 50%;
                transform: translateY(-50%);
            }

            .ink-toc-container.pos-h-left .ink-toc-indicator { right: calc(100% + 6px); }
            .ink-toc-container.pos-h-right .ink-toc-indicator { left: calc(100% + 6px); }

            .ink-toc-container.has-background.pos-h-left .ink-toc-indicator { right: calc(100% + 12px); }
            .ink-toc-container.has-background.pos-h-right .ink-toc-indicator { left: calc(100% + 12px); }

            .ink-toc-item[data-collapsed="true"] .ink-toc-indicator {
                opacity: 1;
            }

            .ink-toc-item.style-solid-horizontal .ink-toc-bar {
                height: var(--toc-thickness, 2px);
                width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50px;
            }

            .ink-toc-item.style-hollow-horizontal .ink-toc-bar {
                height: var(--toc-thickness, 2px);
                width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                border: 1px solid var(--item-color);
                border-radius: 50px;
                background: transparent;
                box-sizing: border-box;
            }

            .ink-toc-item.style-solid-vertical .ink-toc-bar {
                width: var(--toc-thickness, 2px);
                height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50px;
            }

            .ink-toc-item.style-hollow-vertical .ink-toc-bar {
                width: var(--toc-thickness, 2px);
                height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                border: 1px solid var(--item-color);
                border-radius: 50px;
                background: transparent;
                box-sizing: border-box;
            }

            .ink-toc-item.style-solid-dot .ink-toc-bar {
                width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                height: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                min-width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50%;
            }

            .ink-toc-item.style-hollow-dot .ink-toc-bar {
                width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                height: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                min-width: calc(var(--toc-dot-size, 8px) / var(--item-level, 1));
                border: 1.5px solid var(--item-color);
                border-radius: 50%;
                background: transparent;
                box-sizing: border-box;
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
                width: 10px;
                height: 10px;
                background-color: var(--text-muted);
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
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='352 256 26 25'%3E%3Cpath d='M364.574202,279.711806 C353.751102,279.711806 352.190302,276.850306 357.601902,266.929106 C363.013402,257.008006 366.135102,257.008006 371.546602,266.929106 C376.958102,276.850306 375.397302,279.711806 364.574202,279.711806 Z'/%3E%3C/svg%3E");
                mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='352 256 26 25'%3E%3Cpath d='M364.574202,279.711806 C353.751102,279.711806 352.190302,276.850306 357.601902,266.929106 C363.013402,257.008006 366.135102,257.008006 371.546602,266.929106 C376.958102,276.850306 375.397302,279.711806 364.574202,279.711806 Z'/%3E%3C/svg%3E");
                transform: none;
            }

            .ink-toc-scroll-down {
                -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='352 256 26 25'%3E%3Cpath d='M364.574202,279.711806 C353.751102,279.711806 352.190302,276.850306 357.601902,266.929106 C363.013402,257.008006 366.135102,257.008006 371.546602,266.929106 C376.958102,276.850306 375.397302,279.711806 364.574202,279.711806 Z'/%3E%3C/svg%3E");
                mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='352 256 26 25'%3E%3Cpath d='M364.574202,279.711806 C353.751102,279.711806 352.190302,276.850306 357.601902,266.929106 C363.013402,257.008006 366.135102,257.008006 371.546602,266.929106 C376.958102,276.850306 375.397302,279.711806 364.574202,279.711806 Z'/%3E%3C/svg%3E");
                transform: rotate(180deg);
            }

            .ink-toc-scroll-indicator.is-visible {
                opacity: 0.4;
            }

            .ink-toc-container.pos-h-left .ink-toc-scroll-indicator {
                align-self: flex-start;
                margin-left: calc((var(--toc-thickness, 2px) / 2) - 5px);
            }

            .ink-toc-container.pos-h-right .ink-toc-scroll-indicator {
                align-self: flex-end;
                margin-right: calc((var(--toc-thickness, 2px) / 2) - 5px);
            }

            .ink-toc-container.active-style-solid-dot.pos-h-left .ink-toc-scroll-indicator,
            .ink-toc-container.active-style-hollow-dot.pos-h-left .ink-toc-scroll-indicator {
                margin-left: calc((var(--toc-dot-size, 8px) / 2) - 5px);
            }

            .ink-toc-container.active-style-solid-dot.pos-h-right .ink-toc-scroll-indicator,
            .ink-toc-container.active-style-hollow-dot.pos-h-right .ink-toc-scroll-indicator {
                margin-right: calc((var(--toc-dot-size, 8px) / 2) - 5px);
            }

            .ink-toc-container.has-background {
                border-radius: 50px;
                padding: 10px 0;
                border: none;
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

            .ink-toc-container.bg-style-solid {
                background-color: color-mix(in srgb, var(--toc-bg-color) var(--toc-bg-opacity), transparent);
                border: 2px solid var(--background-modifier-border);
            }

            .ink-toc-container.bg-style-glass {
                background-color: color-mix(in srgb, var(--toc-bg-color) var(--toc-bg-opacity), transparent);
                backdrop-filter: blur(16px) saturate(150%);
                -webkit-backdrop-filter: blur(16px) saturate(150%);
            }

            .theme-light .ink-toc-container.bg-style-glass {
                border: 1px solid rgba(0, 0, 0, 0.08);
                box-shadow:
                    2px 4px 12px rgba(0, 0, 0, 0.06),
                    inset 1.5px 0 0 rgba(255, 255, 255, 0.7);
            }

            .theme-dark .ink-toc-container.bg-style-glass {
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow:
                    2px 4px 12px rgba(0, 0, 0, 0.4),
                    inset 1.5px 0 0 rgba(255, 255, 255, 0.12);
            }

            .ink-toc-active-left .markdown-source-view:not(.is-readable-line-width) .cm-scroller,
            .ink-toc-active-left .markdown-reading-view:not(.is-readable-line-width) .markdown-preview-view {
                padding-left: var(--toc-overlap-padding, 80px) !important;
            }

            .ink-toc-active-right .markdown-source-view:not(.is-readable-line-width) .cm-scroller,
            .ink-toc-active-right .markdown-reading-view:not(.is-readable-line-width) .markdown-preview-view {
                padding-right: var(--toc-overlap-padding, 80px) !important;
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

        document.body.style.setProperty('--toc-bg-opacity', `${this.settings.bgOpacity}%`);

        const effectiveBgColor = this.settings.bgColor ? this.settings.bgColor : 'var(--background-secondary)';
        document.body.style.setProperty('--toc-bg-color', effectiveBgColor);

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
            for (let i = 1; i <= 6; i++) {
                const key = `h${i}Color`;
                new Setting(containerEl)
                    .setName(`H${i} Color`)
                    .addColorPicker(color => color
                        .setValue(this.plugin.settings[key])
                        .onChange(async (value) => {
                            this.plugin.settings[key] = value;
                            await this.plugin.saveSettings();
                        }));
            }
        }

        containerEl.createEl('br');

        new Setting(containerEl)
            .setName('TOC Background')
            .setDesc('Display a rounded background container behind the TOC.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showBackground)
                .onChange(async (value) => {
                    this.plugin.settings.showBackground = value;
                    await this.plugin.saveSettings();
                    this.display();
                }));

        if (this.plugin.settings.showBackground) {
            new Setting(containerEl)
                .setName('Background Style')
                .setDesc('Choose between a frosted glass or a flat solid color background.')
                .addDropdown(drop => drop
                    .addOption('glass', 'Glass')
                    .addOption('solid', 'Solid Color')
                    .setValue(this.plugin.settings.bgStyle)
                    .onChange(async (value) => {
                        this.plugin.settings.bgStyle = value;
                        await this.plugin.saveSettings();
                        this.display();
                    }));

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

            if (this.plugin.settings.bgStyle === 'solid') {
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
