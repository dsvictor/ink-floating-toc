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
    barStyle: 'solid-horizontal',
    barLength: 1.0,
    barThickness: 2,
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
    }

    refreshTOC() {
        this.removeTOC();
        
        const leaf = this.app.workspace.activeLeaf || this.app.workspace.getMostRecentLeaf();
        if (!leaf || !leaf.view) return;
        
        const view = leaf.view;
        const viewType = view.getViewType();
        
        if (viewType !== 'markdown' && viewType !== 'empty') return;

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
        container.classList.add('ink-toc-container', `pos-h-${this.settings.horizontalPos}`, `pos-v-${this.settings.verticalPos}`);
        
        if (viewType === 'empty') {
            container.classList.add('is-empty-tab');
        }
        
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

        container.appendChild(list);
        
        const rootEl = view.contentEl || view.containerEl;
        const sView = rootEl.querySelector('.markdown-source-view');
        const rView = rootEl.querySelector('.markdown-reading-view');
        
        if (sView) {
            sView.insertAdjacentElement('beforebegin', container);
        } else if (rView) {
            rView.insertAdjacentElement('beforebegin', container);
        } else {
            rootEl.appendChild(container);
        }
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
                top: calc(12.5% - (0.875 * var(--toc-offset-d)));
                bottom: calc(12.5% + (0.125 * var(--toc-offset-d)));
                height: auto;
            }
            
            /* Strict Horizontal Anchoring (Removed offset over-engineering) */
            .ink-toc-container.pos-h-left { left: 20px; right: auto; }
            .ink-toc-container.pos-h-right { right: 20px; left: auto; }
            
            .ink-toc-container.pos-v-top { justify-content: flex-start; }
            .ink-toc-container.pos-v-middle { justify-content: center; }
            .ink-toc-container.pos-v-bottom { justify-content: flex-end; }
            
            .ink-toc-list {
                display: flex;
                flex-direction: column;
                gap: 6px;
                pointer-events: auto;
                align-items: flex-start; 
                
                max-height: 100%;
                overflow-y: auto;
                overscroll-behavior: contain;
                scrollbar-width: none; 
                
                /* iPad/Mobile Touch Fixes */
                touch-action: pan-y; /* Strictly lock touch movements to vertical scrolling */
                -webkit-user-select: none; /* Prevent accidental text highlighting while tapping */
                user-select: none; 
            }
            
            .ink-toc-list::-webkit-scrollbar { 
                display: none; 
            }
            
            .ink-toc-container.pos-h-right .ink-toc-list {
                align-items: flex-end; 
            }
            
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
                /* Force H1 dimensions */
                --item-level: 1 !important; 
            }
            
            .ink-toc-item.toc-empty-state:hover {
                opacity: 0.5;
            }

            .ink-toc-indicator {
                width: 6px;
                height: 6px;
                border-radius: 50px;
                background-color: var(--item-color);
                margin: 0 4px;
                opacity: 0;
                transition: opacity 0.2s;
            }
            
            .ink-toc-item[data-collapsed="true"] .ink-toc-indicator {
                opacity: 1;
            }

            /* Style: Solid Horizontal */
            .ink-toc-item.style-solid-horizontal .ink-toc-bar {
                height: var(--toc-thickness, 2px);
                width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50px;
            }
            
            /* Style: Hollow Horizontal */
            .ink-toc-item.style-hollow-horizontal .ink-toc-bar {
                height: var(--toc-thickness, 2px); 
                width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-width: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                border: 1px solid var(--item-color);
                border-radius: 50px;
                background: transparent;
                box-sizing: border-box; 
            }

            /* Style: Solid Vertical */
            .ink-toc-item.style-solid-vertical .ink-toc-bar {
                width: var(--toc-thickness, 2px);
                height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                background-color: var(--item-color);
                border-radius: 50px;
            }

            /* Style: Hollow Vertical */
            .ink-toc-item.style-hollow-vertical .ink-toc-bar {
                width: var(--toc-thickness, 2px); 
                height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                min-height: calc(24px * var(--toc-length, 1) / var(--item-level, 1));
                border: 1px solid var(--item-color);
                border-radius: 50px;
                background: transparent;
                box-sizing: border-box; 
            }

            .ink-toc-item[data-level="1"] { --item-level: 1; }
            .ink-toc-item[data-level="2"] { --item-level: 1.2; }
            .ink-toc-item[data-level="3"] { --item-level: 1.5; }
            .ink-toc-item[data-level="4"] { --item-level: 1.8; }
            .ink-toc-item[data-level="5"] { --item-level: 2.2; }
            .ink-toc-item[data-level="6"] { --item-level: 2.8; }
        `;
        document.head.appendChild(style);
        this.updateCSSVariables();
    }

    updateCSSVariables() {
        document.body.style.setProperty('--toc-length', this.settings.barLength);
        document.body.style.setProperty('--toc-thickness', `${this.settings.barThickness}px`);
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
            .setName('Bar Style')
            .addDropdown(drop => drop
                .addOption('solid-horizontal', 'Solid Horizontal')
                .addOption('hollow-horizontal', 'Hollow Horizontal')
                .addOption('solid-vertical', 'Solid Vertical')
                .addOption('hollow-vertical', 'Hollow Vertical')
                .setValue(this.plugin.settings.barStyle)
                .onChange(async (value) => {
                    this.plugin.settings.barStyle = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Bar Length')
            .addSlider(slider => slider
                .setLimits(0.5, 3.0, 0.1)
                .setValue(this.plugin.settings.barLength)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.barLength = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Bar Thickness')
            .addSlider(slider => slider
                .setLimits(1, 10, 1)
                .setValue(this.plugin.settings.barThickness)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.barThickness = value;
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
            containerEl.createEl('h3', { text: 'Heading Colors' });

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
