/* Floating TOC */

var Me=Object.create;var q=Object.defineProperty,Ie=Object.defineProperties,De=Object.getOwnPropertyDescriptor,Fe=Object.getOwnPropertyDescriptors,qe=Object.getOwnPropertyNames,Q=Object.getOwnPropertySymbols,Pe=Object.getPrototypeOf,Z=Object.prototype.hasOwnProperty,ze=Object.prototype.propertyIsEnumerable;var ee=(i,e,t)=>e in i?q(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,P=(i,e)=>{for(var t in e||(e={}))Z.call(e,t)&&ee(i,t,e[t]);if(Q)for(var t of Q(e))ze.call(e,t)&&ee(i,t,e[t]);return i},W=(i,e)=>Ie(i,Fe(e)),te=i=>q(i,"__esModule",{value:!0});var Re=(i,e)=>{te(i);for(var t in e)q(i,t,{get:e[t],enumerable:!0})},Be=(i,e,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of qe(e))!Z.call(i,n)&&n!=="default"&&q(i,n,{get:()=>e[n],enumerable:!(t=De(e,n))||t.enumerable});return i},z=i=>Be(te(q(i!=null?Me(Pe(i)):{},"default",i&&i.__esModule&&"default"in i?{get:()=>i.default,enumerable:!0}:{value:i,enumerable:!0})),i);var x=(i,e,t)=>new Promise((n,o)=>{var a=r=>{try{l(t.next(r))}catch(c){o(c)}},s=r=>{try{l(t.throw(r))}catch(c){o(c)}},l=r=>r.done?n(r.value):Promise.resolve(r.value).then(a,s);l((t=t.apply(i,e)).next())});Re(exports,{default:()=>X,refresh_node:()=>N,selfDestruct:()=>F});var T=z(require("obsidian"));var S=z(require("obsidian"));function R(i,e){return i+1<e.length?e[i+1].level>e[i].level:!1}function $(i,e,t){let n,o;i instanceof MouseEvent?(i.stopPropagation(),n=e,o=t||!1):(n=i,o=e);let a=n.getAttribute("isCollapsed");a!==null&&(a==="true"?Ne(n,o):a==="false"&&Ve(n))}function Ne(i,e){i.setAttribute("isCollapsed","false");let t=parseInt(i.getAttribute("data-level")),n=i.nextElementSibling;if(e)for(;n&&parseInt(n.getAttribute("data-level"))>t;)n.style.display="block",n.getAttribute("isCollapsed")!==null&&n.setAttribute("isCollapsed","false"),n=n.nextElementSibling;else{let o=!1,a=Number.MAX_VALUE;for(;n&&parseInt(n.getAttribute("data-level"))>t;){let s=n.getAttribute("isCollapsed")!==null,l=parseInt(n.getAttribute("data-level"));o?l<=a&&(n.style.display="block",o=s,a=s?l:Number.MAX_VALUE):(s&&(o=!0,a=l),n.style.display="block"),n=n.nextElementSibling}}}function Ve(i){i.setAttribute("isCollapsed","true");let e=parseInt(i.getAttribute("data-level")),t=i.nextElementSibling;for(;t&&parseInt(t.getAttribute("data-level"))>e;)t.style.display="none",t.getAttribute("isCollapsed")!==null&&t.setAttribute("isCollapsed","true"),t=t.nextElementSibling}function ne(i,e){i.querySelectorAll("li.heading-list-item[iscollapsed]").forEach(n=>{let o=n,a=o.getAttribute("isCollapsed")==="true";e!==!a&&$(o,e)})}var xe=z(require("obsidian"));var ie={};var ae={};var se={};var oe={};var j={"ctrl + click on the floating toc to collapse/expand the header.":"ctrl + click on the floating toc to collapse/expand the header.","Floating TOC position":"Floating TOC position","Floating TOC position, default on the left side of the notes":"Floating TOC position, default on the left side of the notes","Hide heading level":"Hide heading level","Whichever option is selected, the corresponding heading level will be hidden":"Whichever option is selected, the corresponding heading level will be hidden","Plugin Settings":"Plugin Settings","Default Pin":"Default Pin","Enable Content Offset When Pinned":"Enable Content Offset When Pinned","When enabled, note content will be offset when TOC is pinned":"When enabled, note content will be offset when TOC is pinned","Enable Drag to Reorder":"Enable Drag to Reorder","When enabled, you can drag headings in TOC to reorder them in the document":"When enabled, you can drag headings in TOC to reorder them in the document","Enable Tooltip":"Enable Tooltip","Enable Search":"Enable Search","Enable quick search functionality in floating TOC. Press any key when TOC is active to start searching.":"Enable quick search functionality in floating TOC. Press any key when TOC is active to start searching.","Plugin Style Settings":"Plugin Style Settings","Mobile enabled or not":"Mobile enabled or not","Whether to enable the plugin for the mobile client, the default is enabled.":"Whether to enable the plugin for the mobile client, the default is enabled.","If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)":"If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)","Left alignment of TOC text":"Left alignment of TOC text","Aligned on both sides":"Aligned on both sides","Floating TOC position, on the right side of the notes":"Floating TOC position, on the right side of the notes","whether the text in TOC is left aligned":"whether the text in TOC is left aligned","When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.":"When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.","Set the default collapsed level of headings when initialised":"Set the default collapsed level of headings when initialised","Default Collapsed Level":"Default Collapsed Levels","Expand All Subheadings Recursively":"Expand All Subheadings Recursively","When disabled, only direct subheadings will be expanded":"When disabled, only direct subheadings will be expanded","Basic Settings":"Basic Settings","TOC Display Settings":"TOC Display Settings","Interaction Settings":"Interaction Settings","Style Settings":"Style Settings","Default Hide TOC":"Default Hide TOC","When enabled, TOC will be hidden by default when plugin starts":"When enabled, TOC will be hidden by default when plugin starts","Header single line display":"Header single line display","When enabled, heading text will be displayed in a single line":"When enabled, heading text will be displayed in a single line","Bar Style":"Bar Style","Choose the style of the indicator bar":"Choose the style of the indicator bar",Default:"Default",Icon:"Icon",Bold:"Bold","Show heading text next to indicator bar":"Show heading text next to indicator bar","When enabled, heading text will be shown next to the indicator bar":"When enabled, heading text will be shown next to the indicator bar","More Style Settings":"More Style Settings","Notice: Please click the button again,If the floating-toc option is not found in the style settings":"Notice: Please click the button again,If the floating-toc option is not found in the style settings","Search in TOC ":"Search in TOC ","Search in Floating TOC":"Search in Floating TOC",Search:"Search","Search title... ":"Search TOC title... ","Search results":"Search results","No results found":"No results found","Press Enter to jump to selected title":"Press Enter to jump to selected title","Press Escape to cancel search":"Press Escape to cancel search","Use arrow keys to navigate results":"Use arrow keys to navigate results","Close search":"Close search"};var le={};var re={};var ce={};var de={};var he={};var ge={};var ue={};var pe={};var fe={};var me={};var be={};var ve={};var ye={};var Ce={};var Te={};var Ee={};var we={"ctrl + click on the floating toc to collapse/expand the header.":"\u6309\u4F4Fctrl \u70B9\u51FB\u76EE\u5F55\u4E2D\u7684\u6807\u9898\uFF0C\u53EF\u4EE5\u4F7F\u5BF9\u5E94\u7684\u6B63\u6587\u5185\u5BB9\u6298\u53E0/\u5C55\u5F00\u3002","Floating TOC position":"\u6D6E\u52A8\u76EE\u5F55\u663E\u793A\u4F4D\u7F6E","Floating TOC position, default on the left side of the notes":"\u6D6E\u52A8\u76EE\u5F55\u663E\u793A\u4F4D\u7F6E\uFF0C\u9ED8\u8BA4\u663E\u793A\u5728\u7B14\u8BB0\u5DE6\u4FA7","Hide heading level":"\u9690\u85CF\u6307\u5B9A\u7684\u6807\u9898\u5C42\u7EA7","Whichever option is selected, the corresponding heading level will be hidden":"\u9690\u85CF\u9009\u4E2D\u7684\u6807\u9898\u5C42\u7EA7\uFF0C\u9009\u4E2D\u7684\u6807\u9898\u4E0D\u4F1A\u5728\u6D6E\u52A8\u76EE\u5F55\u4E2D\u663E\u793A\u3002","Plugin Settings":"\u63D2\u4EF6\u8BBE\u7F6E","Default Pin":"\u662F\u5426\u9ED8\u8BA4\u9489\u5728\u7B14\u8BB0\u4E0A","Enable Content Offset When Pinned":"\u56FA\u5B9A\u65F6\u542F\u7528\u7B14\u8BB0\u5185\u5BB9\u504F\u79FB","When enabled, note content will be offset when TOC is pinned":"\u542F\u7528\u540E\uFF0C\u5F53\u76EE\u5F55\u56FA\u5B9A\u65F6\u7B14\u8BB0\u5185\u5BB9\u4F1A\u81EA\u52A8\u504F\u79FB","Enable Drag to Reorder":"\u542F\u7528\u62D6\u62FD\u91CD\u6392","When enabled, you can drag headings in TOC to reorder them in the document":"\u542F\u7528\u540E\uFF0C\u53EF\u4EE5\u62D6\u62FD\u76EE\u5F55\u4E2D\u7684\u6807\u9898\u6765\u91CD\u65B0\u6392\u5217\u6587\u6863\u4E2D\u7684\u5185\u5BB9","Enable Tooltip":"\u662F\u5426\u5F00\u542F\u6807\u9898\u63D0\u793A","Enable Search":"\u542F\u7528\u641C\u7D22\u529F\u80FD","Enable quick search functionality in floating TOC. Press any key when TOC is active to start searching.":"\u542F\u7528\u6D6E\u52A8\u76EE\u5F55\u7684\u5FEB\u901F\u641C\u7D22\u529F\u80FD\u3002\u5F53\u76EE\u5F55\u6FC0\u6D3B\u65F6\u6309\u4EFB\u610F\u952E\u5F00\u59CB\u641C\u7D22\u3002","Plugin Style Settings":"\u63D2\u4EF6\u6837\u5F0F\u8BBE\u7F6E","Mobile enabled or not":"\u662F\u5426\u5728\u79FB\u52A8\u7AEF\u542F\u7528","Whether to enable the plugin for the mobile client, the default is enabled.":"\u79FB\u5BA2\u6237\u7AEF\u662F\u5426\u542F\u7528\u63D2\u4EF6\uFF0C\u9ED8\u8BA4\u542F\u7528\u3002","If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)":"\u5982\u679Cstyle setting \u4E2D\u65E0\u6CD5\u770B\u5230 floating Toc\u9009\u9879\uFF0C\u8BF7\u91CD\u8F7Dstyle setting\u63D2\u4EF6\uFF08\u5173\u95ED\u518D\u5F00\u542F\u5373\u53EF\uFF09","Left alignment of TOC text":"\u76EE\u5F55\u6587\u5B57\u5DE6\u5BF9\u9F50","Floating TOC position, on the right side of the notes":"\u6D6E\u52A8\u76EE\u5F55\u663E\u793A\u4F4D\u7F6E\uFF0C\u663E\u793A\u5728\u7B14\u8BB0\u53F3\u4FA7","whether the text in TOC is left aligned":"\u5F53\u5DE5\u5177\u680F\u5728\u53F3\u4FA7\u65F6\uFF0C\u76EE\u5F55\u4E2D\u7684\u6807\u9898\u662F\u5426\u5DE6\u5BF9\u9F50","Aligned on both sides":"\u4E24\u7AEF\u5BF9\u9F50","When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.":"\u5F53\u9762\u677F\u5DE6\u53F3\u5206\u5272\u7684\u65F6\u5019\uFF0C\u53F3\u4FA7\u7248\u9762\u53F3\u5BF9\u9F50\uFF0C\u5DE6\u4FA7\u9762\u677F\u5DE6\u5BF9\u9F50\u3002","Set the default collapsed level of headings when initialised":"\u8BBE\u7F6E\u521D\u59CB\u5316\u65F6TOC\u4E2D\u9ED8\u8BA4\u6298\u53E0\u7684\u6807\u9898\u7EA7\u522B","Default Collapsed Level":"\u9ED8\u8BA4\u6298\u53E0\u7EA7\u522B","Expand All Subheadings Recursively":"\u9012\u5F52\u5C55\u5F00\u6240\u6709\u5B50\u6807\u9898","When disabled, only direct subheadings will be expanded":"\u5173\u95ED\u6B64\u9009\u9879\u65F6, \u53EA\u5C55\u5F00\u76F4\u63A5\u5B50\u6807\u9898","Basic Settings":"\u57FA\u672C\u8BBE\u7F6E","TOC Display Settings":"\u76EE\u5F55\u663E\u793A\u8BBE\u7F6E","Interaction Settings":"\u4EA4\u4E92\u8BBE\u7F6E","Style Settings":"\u6837\u5F0F\u8BBE\u7F6E","Default Hide TOC":"\u9ED8\u8BA4\u9690\u85CF\u76EE\u5F55","When enabled, TOC will be hidden by default when plugin starts":"\u542F\u7528\u540E\uFF0C\u63D2\u4EF6\u542F\u52A8\u65F6\u76EE\u5F55\u5C06\u9ED8\u8BA4\u9690\u85CF","Header single line display":"\u76EE\u5F55\u6807\u9898\u5355\u884C\u663E\u793A","When enabled, heading text will be displayed in a single line":"\u542F\u7528\u540E\uFF0C\u76EE\u5F55\u6807\u9898\u5C06\u5728\u4E00\u884C\u5185\u663E\u793A","Bar Style":"\u6307\u793A\u6761\u6837\u5F0F","Choose the style of the indicator bar":"\u9009\u62E9\u6307\u793A\u6761\u7684\u6837\u5F0F",Default:"\u9ED8\u8BA4",Icon:"\u56FE\u6807",Bold:"\u7C97\u4F53","Show heading text next to indicator bar":"\u5728\u6307\u793A\u6761\u65C1\u8FB9\u663E\u793A\u6807\u9898\u4E0A\u4E0B\u7EA7","When enabled, heading text will be shown next to the indicator bar":"\u542F\u7528\u540E\uFF0C\u6807\u9898\u6587\u672C\u5C06\u663E\u793A\u5728\u6307\u793A\u6761\u65C1\u8FB9","More Style Settings":"\u66F4\u591A\u6837\u5F0F\u8BBE\u7F6E","Notice: Please click the button again,If the floating-toc option is not found in the style settings":"Notice: Please click the button again,If the floating-toc option is not found in the style settings","Search in TOC ":"\u5728\u76EE\u5F55\u4E2D\u641C\u7D22 ","Search in Floating TOC":"\u5728\u6D6E\u52A8\u76EE\u5F55\u4E2D\u641C\u7D22",Search:"\u641C\u7D22","Search title... ":"\u641C\u7D22\u5927\u7EB2\u6807\u9898... ","Search results":"\u641C\u7D22\u7ED3\u679C","No results found":"\u672A\u627E\u5230\u7ED3\u679C","Press Enter to jump to selected title":"\u6309\u56DE\u8F66\u952E\u8DF3\u8F6C\u5230\u9009\u4E2D\u7684\u6807\u9898","Press Escape to cancel search":"\u6309ESC\u952E\u53D6\u6D88\u641C\u7D22","Use arrow keys to navigate results":"\u4F7F\u7528\u7BAD\u5934\u952E\u5BFC\u822A\u7ED3\u679C","Close search":"\u5173\u95ED\u641C\u7D22"};var Se={"Floating TOC position":"\u6D6E\u52D5\u76EE\u9304\u986F\u793A\u4F4D\u7F6E","Floating TOC position, default on the left side of the notes":"\u6D6E\u52D5\u76EE\u9304\u986F\u793A\u4F4D\u7F6E\uFF0C\u9ED8\u8A8D\u986F\u793A\u5728\u7B46\u8A18\u5DE6\u5074","Ignore top-level headers":"\u662F\u5426\u5FFD\u7565\u9802\u7D1A\u76EE\u9304","Select whether to ignore the top-level headings. When turned on, the top-level headings in the current note are not displayed in the floating TOC.":"\u9078\u64C7\u662F\u5426\u5FFD\u7565\u9802\u7D1A\u6A19\u984C\uFF0C\u958B\u555F\u5F8C\u7576\u524D\u6587\u6A94\u4E2D\u6700\u9802\u7D1A\u7684\u6A19\u984C\u4E0D\u986F\u793A\u5728\u6D6E\u52D5\u76EE\u9304\u4E2D\u3002","Plugin Settings":"\u63D2\u4EF6\u8A2D\u7F6E","Default Pin":"\u662F\u5426\u9ED8\u8A8D\u91D8\u5728\u7B46\u8A18\u4E0A","Plugin Style Settings":"\u63D2\u4EF6\u6A23\u5F0F\u8A2D\u7F6E","Mobile enabled or not":"\u662F\u5426\u5728\u79FB\u52D5\u7AEF\u555F\u7528","Whether to enable the plugin for the mobile client, the default is enabled.":"\u79FB\u52D5\u5BA2\u6236\u7AEF\u662F\u5426\u555F\u7528\u63D2\u4EF6\uFF0C\u9ED8\u8A8D\u555F\u7528\u3002","If the floating Toc option is not found in the style setting, please reload the style setting plugin (turn it off and on again)":"\u5982\u679Cstyle setting \u4E2D\u7121\u6CD5\u770B\u5230 floating Toc\u9078\u9805\uFF0C\u8ACB\u91CD\u8F09style setting\u63D2\u4EF6\uFF08\u95DC\u9589\u518D\u958B\u555F\u5373\u53EF\uFF09","Left alignment of TOC text":"\u76EE\u9304\u6587\u5B57\u5DE6\u5C0D\u9F4A","Floating TOC position, on the right side of the notes":"\u6D6E\u52D5\u76EE\u9304\u986F\u793A\u4F4D\u7F6E\uFF0C\u986F\u793A\u5728\u7B46\u8A18\u53F3\u5074","whether the text in TOC is left or right aligned When the floating toc is on the right":"\u7576\u5DE5\u5177\u6B04\u5728\u53F3\u5074\u6642\uFF0C\u76EE\u9304\u4E2D\u7684\u6A19\u984C\u662F\u5426\u5DE6\u5C0D\u9F4A","Aligned on both sides":"\u5169\u7AEF\u5C0D\u9F4A","When the panel is split left and right, the right side of the layout is aligned right and the left side of the panel is aligned left.":"\u7576\u9762\u677F\u5DE6\u53F3\u5206\u5272\u7684\u6642\u5019\uFF0C\u53F3\u5074\u7248\u9762\u53F3\u5C0D\u9F4A\uFF0C\u5DE6\u5074\u9762\u677F\u5DE6\u5C0D\u9F4A\u3002"};var We={ar:ie,cs:ae,da:se,de:oe,en:j,"en-gb":le,es:re,fr:ce,hi:de,id:he,it:ge,ja:ue,ko:pe,nl:fe,nn:me,pl:be,pt:ve,"pt-br":ye,ro:Ce,ru:Te,tr:Ee,"zh-cn":we,"zh-tw":Se},Le=We[xe.moment.locale()];function b(i){return Le&&Le[i]||j[i]}var _=z(require("obsidian"));function He(i,e,t){let n=i[e],o=n.level,a=n.position.start.line,s=-1;for(let h=e+1;h<i.length;h++)if(i[h].level<=o){s=i[h].position.start.line;break}let l=t.split(`\n`);s===-1&&(s=l.length);let c=l.slice(a,s).join(`\n`);return{start:a,end:s,content:c}}function $e(i,e,t,n){return x(this,null,function*(){try{let o=i.editor,a=o.getValue(),s=He(n,e,a),l;if(t<e)l=n[t].position.start.line;else{let f=n[t];l=He(n,t,a).end}let r=a.split(`\n`),c=r.slice(s.start,s.end);r.splice(s.start,s.end-s.start),l>s.start&&(l-=s.end-s.start),r.splice(l,0,...c);let h=r.join(`\n`);return o.setValue(h),!0}catch(o){return console.error("\u79FB\u52A8\u6807\u9898\u5185\u5BB9\u5931\u8D25:",o),new _.Notice("\u79FB\u52A8\u6807\u9898\u5931\u8D25"),!1}})}function ke(i,e,t,n,o){!i.settings.enableDragReorder||(e.setAttribute("draggable","true"),e.classList.add("draggable-heading"),e.addEventListener("dragstart",a=>{a.stopPropagation(),e.classList.add("dragging"),a.dataTransfer&&(a.dataTransfer.effectAllowed="move",a.dataTransfer.setData("text/plain",n.toString()))}),e.addEventListener("dragend",a=>{var l;a.stopPropagation(),e.classList.remove("dragging");let s=(l=e.parentElement)==null?void 0:l.querySelectorAll(".heading-list-item");s==null||s.forEach(r=>{r.classList.remove("drag-over"),r.classList.remove("drag-over-top"),r.classList.remove("drag-over-bottom")})}),e.addEventListener("dragover",a=>{if(a.preventDefault(),a.stopPropagation(),e.classList.contains("dragging"))return;a.dataTransfer&&(a.dataTransfer.dropEffect="move");let s=e.getBoundingClientRect(),l=s.top+s.height/2;a.clientY<l?(e.classList.add("drag-over-top"),e.classList.remove("drag-over-bottom")):(e.classList.add("drag-over-bottom"),e.classList.remove("drag-over-top"))}),e.addEventListener("dragleave",a=>{a.stopPropagation(),e.classList.remove("drag-over-top"),e.classList.remove("drag-over-bottom")}),e.addEventListener("drop",a=>x(this,null,function*(){var p,E;if(a.preventDefault(),a.stopPropagation(),e.classList.remove("drag-over-top"),e.classList.remove("drag-over-bottom"),e.classList.contains("dragging"))return;let s=(p=a.dataTransfer)==null?void 0:p.getData("text/plain");if(!s)return;let l=parseInt(s),r=n;if(l===r)return;let c=e.getBoundingClientRect(),h=c.top+c.height/2,f=r;if(a.clientY>=h&&(f=r+1),l<r&&a.clientY>=h&&(f=r),yield $e(o,l,f>l?f-1:f,i.headingdata)){new _.Notice("\u6807\u9898\u5DF2\u79FB\u52A8");let y=o.file;if(y){let m=o.contentEl.querySelector(".floating-toc");m&&m.classList.add("updating"),yield new Promise(w=>{let C=i.app.metadataCache.on("changed",M=>{M.path===y.path&&(i.app.metadataCache.offref(C),w())});setTimeout(()=>{i.app.metadataCache.offref(C),w()},2e3)});let k=(E=i.app.metadataCache.getFileCache(y))==null?void 0:E.headings;if(k&&(i.headingdata=k,i.settings.ignoreHeaders)){let w=i.settings.ignoreHeaders.split(",").map(x=>x.replace(/\D/g,"")).filter(Boolean);i.headingdata=k.filter(C=>!w.includes(C.level.toString()))}N(i,o),m&&setTimeout(()=>{m.classList.remove("updating")},150)}}})))}function je(i,e,t,n,o,a){return x(this,null,function*(){let s=/^(?:\s*)[0-9]+\.\s/,l=/^(?:\s*)[\-\+]\s/,r,c="";(r=s.exec(t))!==null?(c=r[0],t=t.replace(s,"")):(r=l.exec(t))!==null&&(c=r[0],t=t.replace(l,""));let h=Number(n.parentElement.getAttribute("data-id")),f=Number(n.parentElement.getAttribute("data-level"));let u=m=>{m.stopImmediatePropagation(),$(m,n.parentElement,i.settings.expandAllSubheadings)};n.parentElement.addEventListener("click",u);n.parentElement.hasAttribute("isCollapsed")?R(h,i.headingdata)||(n.parentElement.removeAttribute("isCollapsed"),n.parentElement.removeEventListener("click",u)):R(h,i.headingdata)&&n.parentElement.setAttribute("isCollapsed","false");let p=n;a=new S.Component,yield S.MarkdownRenderer.renderMarkdown(t,p,o,a),p&&p.classList.add("heading-rendered");let E=document.createElement("a");p.appendChild(E);E.className="text";let navHandler=function(m){var k;m.stopPropagation();let L=(k=parseInt(p.parentElement.getAttribute("data-line")))!=null?k:0;if(m.ctrlKey||m.metaKey)Ue(e,L);else{_e(e,L);let w=p.parentElement.parentElement.querySelector(".text-wrap.located");if(w)w.classList.remove("located");p.classList.add("located")}};p.onclick=navHandler;if(i.settings.isTooltip){let cleanText=i.removeMarkdownSyntax(t);let anc=document.createElement("div");n.parentElement.appendChild(anc);anc.className="toc-tooltip-anchor";anc.setAttribute("aria-label",cleanText);if(i.settings.positionStyle==="right"){anc.setAttribute("data-tooltip-position","left");anc.setAttribute("aria-label-position","left")}else{anc.setAttribute("data-tooltip-position","right");anc.setAttribute("aria-label-position","right")}anc.onclick=navHandler}let y=p.querySelector("p");if(y){let m=/<a[^>]*>|<\/[^>]*a>/gm;c?E.innerHTML=c+y.innerHTML.replace(m,""):E.innerHTML=y.innerHTML.replace(m,"");p.removeChild(y)}})}

function B(plugin, view, parentUl, hdg, index) {
    return x(this, null, function*() {
        if (!hdg) return;
        let li = document.createElement("li");
        li.className = "heading-list-item";
        li.setAttribute("data-level", hdg.level ? hdg.level.toString() : "1");
        li.setAttribute("data-id", index.toString());
        let lineVal = hdg.position && hdg.position.start ? hdg.position.start.line : 0;
        li.setAttribute("data-line", lineVal.toString());

        let s = document.createElement("div");
        s.className = "text-wrap";
        li.appendChild(s);
        let path = (view && view.file) ? view.file.path : "";
        yield je(plugin, view, hdg.heading, s, path, null);

        let l = document.createElement("div");
        l.className = "line-wrap";
        let lineInner = document.createElement("div");
        lineInner.className = "line";
        l.appendChild(lineInner);
        li.appendChild(l);
        ke(plugin, li, hdg, index, view);
        
        parentUl.appendChild(li);
    });
}

var _e = (view, line) => { if (view && view.leaf && view.file) view.leaf.openFile(view.file, { eState: { line: line } }); };
var Ue = (plugin, view, line) => {
    if (!view || !view.currentMode) return;
    let currentMode = view.currentMode;
    let folds = currentMode.getFoldInfo ? currentMode.getFoldInfo().folds : [];
    let found = -1;
    for (let i = 0; i < folds.length; i++) { if (folds[i].from === line) { found = i; break; } }
    if (found > -1) folds.splice(found, 1);
    else folds.push({ from: line, to: line + 1 });
    if (currentMode.applyFoldInfo) currentMode.applyFoldInfo({ folds: folds, lines: view.editor ? view.editor.lineCount() : 100 });
    if (view.onMarkdownFold) view.onMarkdownFold();
};

function V(appInstance, pluginInstance, view) {
    if (document.body.classList.contains("is-phone")) return;
    
    if (!view) {
        let leaf = appInstance.workspace.getLeaf(false) || appInstance.workspace.activeLeaf;
        view = leaf ? leaf.view : null;
    }
    if (!view || (view.getViewType() !== "markdown" && view.getViewType() !== "empty")) return;
    
    let rootEl = view.contentEl || view.containerEl;
    if (!rootEl) return;
    if (rootEl.querySelector(".floating-toc-div")) return;

    let l = document.createElement("div");
    l.className = "floating-toc-div";
    pluginInstance.BAR_STYLE_CLASSES.forEach(r => document.body.classList.remove(r));
    if (pluginInstance.settings.isDefaultPin) l.classList.add("pin");
    if (pluginInstance.settings.isDefaultHide) l.classList.add("hide");
    if (pluginInstance.settings.enableHeadingNowrap) document.body.classList.add("enable-heading-nowrap");
    if (pluginInstance.settings.enableBarHeadingText) document.body.classList.add("enable-bar-heading-text");
    if (pluginInstance.settings.enableContentOffset) document.body.classList.add("enable-content-offset");
    document.body.classList.add(pluginInstance.settings.barStyle || "enable-horizontal-solid-line-style");
    
    if (pluginInstance.settings.barBackground) {
        document.body.classList.add("enable-pill-container");
    } else {
        document.body.classList.remove("enable-pill-container");
    }

    let file = view.file || appInstance.workspace.getActiveFile();
    let cache = file ? appInstance.metadataCache.getFileCache(file) : null;
    let hdgs = cache ? cache.headings : null;
    let c = [];
    if (hdgs) {
        hdgs.forEach(m => {
            let safeM = Object.assign({}, m);
            safeM.heading = safeM.heading.replace(/<\/?[\s\S]*?(?:".*")*>/g, "");
            c.push(safeM);
        });
    }
    pluginInstance.headingdata = c;

    if (pluginInstance.settings.positionStyle == "right") {
        l.classList.add("floating-right");
    } else if (pluginInstance.settings.positionStyle == "left") {
        l.classList.add("floating-left");
    } else {
        l.classList.add("floating-both");
    }

    let ul = document.createElement("ul");
    ul.className = "floating-toc";
    let toolbar = document.createElement("div");
    U(pluginInstance, toolbar, l);
    l.appendChild(toolbar);
    l.appendChild(ul);

    if (pluginInstance.settings.ignoreHeaders && pluginInstance.headingdata.length > 0) {
        let m = pluginInstance.settings.ignoreHeaders.split(",").map(x => x.replace(/\D/g, "")).filter(Boolean);
        pluginInstance.headingdata = pluginInstance.headingdata.filter(L => !m.includes(L.level.toString()));
    }

    if (pluginInstance.headingdata.length === 0) {
        let emptyLi = document.createElement("li");
        emptyLi.className = "heading-list-item empty-toc-bar";
        emptyLi.setAttribute("data-level", "1");
        
        let anc = document.createElement("div");
        anc.className = "toc-tooltip-anchor empty-anchor";
        anc.setAttribute("aria-label", file ? "No headings available" : "No note open");
        let pos = pluginInstance.settings.positionStyle === "right" ? "left" : "right";
        anc.setAttribute("data-tooltip-position", pos);
        anc.setAttribute("aria-label-position", pos);
        
        emptyLi.appendChild(anc);
        ul.appendChild(emptyLi);
    } else {
        pluginInstance.headingdata.forEach((k, w) => { B(pluginInstance, view, ul, k, w) });
    }

    let sView = rootEl.querySelector(".markdown-source-view");
    let rView = rootEl.querySelector(".markdown-reading-view");
    if (sView) sView.insertAdjacentElement("beforebegin", l);
    else if (rView) rView.insertAdjacentElement("beforebegin", l);
    else rootEl.appendChild(l);

    if (pluginInstance.headingdata && pluginInstance.headingdata.length > 0) pluginInstance.updateTocWidth(l, pluginInstance.headingdata);
    if (pluginInstance.search) pluginInstance.search.initSearch(l);
}

function U(i,e,t){e.className="toolbar hide";new S.ButtonComponent(e).setIcon("pin").setTooltip("pin").onClick(()=>{t.classList.contains("pin")?t.classList.remove("pin"):t.classList.add("pin")});new S.ButtonComponent(e).setIcon("search").setTooltip(b("Search in TOC ")).setClass("search").onClick(()=>{i.search&&i.search.startSearchFromButton()});new S.ButtonComponent(e).setIcon("double-up-arrow-glyph").setTooltip("Scroll to Top").setClass("top").onClick(()=>{let c=i.app.workspace.getActiveViewOfType(S.MarkdownView);c&&c.setEphemeralState({scroll:0})});new S.ButtonComponent(e).setIcon("double-down-arrow-glyph").setTooltip("Scroll to Bottom").setClass("bottom").onClick(()=>x(this,null,function*(){let c=i.app.workspace.getActiveViewOfType(S.MarkdownView);if(c){let h=i.app.workspace.getActiveFile(),u=(yield i.app.vault.cachedRead(h)).split(`\n`),p=u.length;if(c.getMode()==="preview")for(;p>0&&u[p-1].trim()==="";)p--;c.currentMode.applyScroll(p-1)}}));new S.ButtonComponent(e).setIcon("copy").setTooltip("copy TOC to clipboard").setClass("copy").onClick(()=>x(this,null,function*(){let c=i.headingdata.map(h=>`${"    ".repeat(h.level-1)}- [[#${h.heading}]]`);yield navigator.clipboard.writeText(c.join(`\n`));new S.Notice("TOC Copied")}));let r=new S.ButtonComponent(e).setIcon("chevron-down").setTooltip("Collapse/Expand all headings").setClass("toggle-all").onClick(()=>{let c=t.getAttribute("data-all-expanded")==="true";r.setIcon(c?"chevron-right":"chevron-down");ne(t,!c);t.setAttribute("data-all-expanded",(!c).toString())})}var H=z(require("obsidian"));var Ae=["left","right","both"],Oe={ignoreHeaders:"",ignoreTopHeader:!1,positionStyle:"left",verticalPosition:"middle",isLoadOnMobile:!0,isLeft:!1,isDefaultPin:!0,isTooltip:!0,defaultCollapsedLevel:6,expandAllSubheadings:!1,isDefaultHide:!1,enableHeadingNowrap:!0,barStyle:"enable-horizontal-solid-line-style",enableBarHeadingText:!1,enableContentOffset:!1,enableDragReorder:!1,barLength:1,barThickness:2,barBackground:!1,h1Color:"#7aa5c2",h2Color:"#8fb89f",h3Color:"#c69c6d",h4Color:"#a390b2",h5Color:"#bc7e89",h6Color:"#749895"};var Y=class{constructor(e){this.checkedList=[];this.containerEl=e,this.flowListEl=this.containerEl.createDiv({cls:"check-list"})}addItem(e,t,n,o){let a=this.flowListEl.createDiv({cls:"check-item"}),s=a.createEl("input",{type:"checkbox"});return s.checked=n,s.checked&&this.checkedList.push(t),s.addEventListener("change",r=>{s.checked?this.checkedList.includes(t)||this.checkedList.push(t):this.checkedList.includes(t)&&this.checkedList.remove(t)}),s.addEventListener("change",r=>o(s.checked)),a.createDiv({cls:"flow-label"}).setText(e),a}};var K=class extends H.PluginSettingTab{constructor(e,t){super(e,t);this.plugin=t;addEventListener("refresh-toc",()=>{F();V(this.app,this.plugin)})}display(){let e=this.containerEl;e.empty();e.createEl("h2",{text:"Minimal Floating TOC Settings"});new H.Setting(e).setName("Horizontal Position").addDropdown(g=>g.addOption("left","Left").addOption("right","Right").setValue(this.plugin.settings.positionStyle||"left").onChange(v=>{this.plugin.settings.positionStyle=v;this.plugin.saveSettings();dispatchEvent(new Event("refresh-toc"))}));new H.Setting(e).setName("Vertical Position").addDropdown(g=>g.addOption("top","Top").addOption("middle","Middle").addOption("bottom","Bottom").setValue(this.plugin.settings.verticalPosition||"middle").onChange(v=>{this.plugin.settings.verticalPosition=v;this.plugin.saveSettings();document.body.setAttribute('data-toc-valign',v);dispatchEvent(new Event("refresh-toc"))}));new H.Setting(e).setName("Hide Specific Headings").setDesc("Enter heading levels to hide, separated by commas (e.g., h3, h4, h6).").addText(t=>t.setPlaceholder("e.g. h3, h4").setValue(this.plugin.settings.ignoreHeaders||"").onChange(v=>{this.plugin.settings.ignoreHeaders=v;this.plugin.saveSettings();dispatchEvent(new Event("refresh-toc"))}));new H.Setting(e).setName("Bar Style").addDropdown(g=>g.addOption("enable-horizontal-solid-line-style","Solid Line (Horizontal)").addOption("enable-horizontal-hollow-line-style","Hollow Line (Horizontal)").addOption("enable-vertical-line-style","Solid Line (Vertical)").addOption("enable-hollow-line-style","Hollow Line (Vertical)").setValue(this.plugin.settings.barStyle||"enable-horizontal-solid-line-style").onChange(d=>{this.plugin.settings.barStyle=d;this.plugin.saveSettings();dispatchEvent(new Event("refresh-toc"))}));let sliderSetting=new H.Setting(e).setName("Bar Length").setDesc("Adjust bar length (default: 1.0)");sliderSetting.addButton(btn=>btn.setButtonText("Reset").onClick(()=>{this.plugin.settings.barLength=1;this.plugin.saveSettings();document.body.style.setProperty("--toc-bar-multiplier",1);this.display()}));sliderSetting.addSlider(g=>g.setLimits(0.5,3,0.1).setValue(this.plugin.settings.barLength||1).setDynamicTooltip().onChange(v=>{this.plugin.settings.barLength=v;this.plugin.saveSettings();document.body.style.setProperty("--toc-bar-multiplier",v)}));let thicknessSetting=new H.Setting(e).setName("Bar Thickness").setDesc("Adjust bar thickness (default: 2px)");thicknessSetting.addButton(btn=>btn.setButtonText("Reset").onClick(()=>{this.plugin.settings.barThickness=2;this.plugin.saveSettings();document.body.style.setProperty("--toc-line-thickness","2px");this.display()}));thicknessSetting.addSlider(g=>g.setLimits(1,5,1).setValue(this.plugin.settings.barThickness||2).setDynamicTooltip().onChange(v=>{this.plugin.settings.barThickness=v;this.plugin.saveSettings();document.body.style.setProperty("--toc-line-thickness",v+"px")}));new H.Setting(e).setName("Bar Background").setDesc("Wraps the individual timeline bars in a transparent inset pill.").addToggle(t=>t.setValue(this.plugin.settings.barBackground).onChange(v=>{this.plugin.settings.barBackground=v;this.plugin.saveSettings();dispatchEvent(new Event("refresh-toc"))}));new H.Setting(e).setName("Show Tooltip").addToggle(t=>t.setValue(this.plugin.settings.isTooltip).onChange(v=>{this.plugin.settings.isTooltip=v;this.plugin.saveSettings();dispatchEvent(new Event("refresh-toc"))}));e.createEl("h3",{text:"Heading Colors"});const addColorSetting=(name,level,key,defaultColor)=>{new H.Setting(e).setName(name).addColorPicker(c=>c.setValue(this.plugin.settings[key]||defaultColor).onChange(v=>{this.plugin.settings[key]=v;this.plugin.saveSettings();document.body.style.setProperty(`--toc-color-${level}`,v)}));};addColorSetting("H1 Color",1,"h1Color","#7aa5c2");addColorSetting("H2 Color",2,"h2Color","#8fb89f");addColorSetting("H3 Color",3,"h3Color","#c69c6d");addColorSetting("H4 Color",4,"h4Color","#a390b2");addColorSetting("H5 Color",5,"h5Color","#bc7e89");addColorSetting("H6 Color",6,"h6Color","#749895");}};function Ke(i){return i.toLowerCase()}function Ge(i,e){let t=i.toLowerCase(),n=e.toLowerCase();if(n.includes(t)||Ke(e).includes(t))return!0;let a=t.split(""),s=n.split(""),l=0;for(let r=0;r<s.length&&l<a.length;r++)s[r]===a[l]&&l++;return l===a.length}var G=class{constructor(e){this.searchInput=null;this.searchContainer=null;this.plugin=e,this.state={isActive:!1,query:"",results:[],currentIndex:-1,searchTimeout:null}}initSearch(e){this.createSearchInput(e),this.setupKeyboardListeners(e)}createSearchInput(e){this.searchContainer=document.createElement("div");this.searchContainer.className="floating-toc-search-container";e.appendChild(this.searchContainer);this.searchInput=document.createElement("input");this.searchInput.type="text";this.searchInput.placeholder=b("Search title... ");this.searchInput.className="floating-toc-search-input";this.searchContainer.appendChild(this.searchInput);let t=document.createElement("button");t.className="floating-toc-search-close";t.innerHTML="\xD7";t.setAttribute("aria-label",b("Close search"));this.searchContainer.appendChild(t);t.addEventListener("click",()=>{this.hideSearch()});this.searchContainer.style.display="none";this.searchInput.addEventListener("input",n=>{let o=n.target;this.handleSearchInput(o.value)});this.searchInput.addEventListener("keydown",n=>{n.key==="Enter"?(n.preventDefault(),this.selectCurrentResult()):n.key==="Escape"&&(n.preventDefault(),this.hideSearch())})}setupKeyboardListeners(e){document.addEventListener("keydown",t=>{if(!!this.state.isActive)switch(t.key){case"Tab":t.preventDefault(),this.navigateResults(1);break;case"ArrowUp":t.preventDefault(),this.navigateResults(-1);break;case"ArrowDown":t.preventDefault(),this.navigateResults(1);break;case"Enter":t.preventDefault(),this.selectCurrentResult();break;case"Escape":t.preventDefault(),this.hideSearch();break}})}startSearch(e){this.state.isActive=!0,this.state.query=e,this.state.currentIndex=-1,this.searchInput&&(this.searchInput.value=e,this.searchInput.style.display="block",this.searchInput.focus(),this.searchInput.select()),this.searchContainer&&(this.searchContainer.style.display="flex"),this.performSearch()}startSearchFromButton(){this.state.isActive=!0,this.state.query="",this.state.currentIndex=-1,this.searchContainer&&(this.searchContainer.style.display="flex"),this.searchInput&&(this.searchInput.value="",this.searchInput.style.display="block",setTimeout(()=>{this.searchInput.focus(),this.searchInput.select()},10));let e=document.querySelector(".floating-toc-div");e&&(e.classList.contains("pin")?e.classList.add("searchonly"):(e.classList.add("pin"),e.classList.add("search"))),this.performSearch()}handleSearchInput(e){this.state.query=e,this.state.searchTimeout&&clearTimeout(this.state.searchTimeout),this.state.searchTimeout=window.setTimeout(()=>{this.performSearch()},100)}performSearch(){let e=document.querySelector(".floating-toc-div");if(!e)return;let t=e.querySelectorAll(".heading-list-item");if(this.state.results=[],t.forEach(n=>{n.classList.remove("search-highlight","search-current")}),!this.state.query.trim()){this.state.currentIndex=-1,this.updateResultCount(0);return}if(t.forEach(n=>{let o=n.querySelector(".text");if(o){let a=o.textContent||"";Ge(this.state.query,a)&&(this.state.results.push(n),n.classList.add("search-highlight"))}}),this.updateResultCount(this.state.results.length),this.state.results.length>0){this.state.currentIndex=0;let n=this.state.results[0];n.classList.add("search-current"),this.scrollToResult(n)}}updateResultCount(e){this.searchContainer&&this.searchContainer.setAttribute("data-result-count",`${e} results`)}navigateResults(e){if(this.state.results.length!==0&&(this.state.currentIndex>=0&&this.state.currentIndex<this.state.results.length&&this.state.results[this.state.currentIndex].classList.remove("search-current"),this.state.currentIndex+=e,this.state.currentIndex<0?this.state.currentIndex=this.state.results.length-1:this.state.currentIndex>=this.state.results.length&&(this.state.currentIndex=0),this.state.currentIndex>=0&&this.state.currentIndex<this.state.results.length)){let t=this.state.results[this.state.currentIndex];t.classList.add("search-current"),this.scrollToResult(t)}}scrollToResult(e){let t=document.querySelector(".floating-toc-div");if(!t)return;let n=t.querySelector(".floating-toc");if(!n)return;let o=e.offsetTop,a=e.offsetHeight,s=n.clientHeight,l=o-(s/2-a/2);n.scrollTo({top:Math.max(0,l),behavior:"smooth"})}selectCurrentResult(){if(this.state.currentIndex>=0&&this.state.currentIndex<this.state.results.length){let t=this.state.results[this.state.currentIndex].querySelector(".text");t&&t.click()}this.hideSearch()}hideSearch(){this.state.isActive=!1,this.state.query="",this.state.currentIndex=-1;let e=document.querySelector(".floating-toc-div");e&&(e.querySelectorAll(".heading-list-item").forEach(n=>{n.classList.remove("search-highlight","search-current")}),e.classList.contains("searchonly")?e.classList.remove("searchonly"):(e.classList.contains("pin")&&e.classList.contains("search")&&e.classList.remove("pin"),e.classList.remove("search"))),this.searchContainer&&(this.searchContainer.style.display="none"),this.state.searchTimeout&&(clearTimeout(this.state.searchTimeout),this.state.searchTimeout=null)}isSearchActive(){return this.state.isActive}getSearchState(){return P({},this.state)}};var O;function F(){(0,T.requireApiVersion)("0.15.0")?O=activeWindow.document:O=window.document,O.querySelectorAll(".floating-toc-div").forEach(e=>{e&&e.remove()})}

function N(pluginInstance, view) {
    if (document.body.classList.contains("is-phone")) return false;
    if (!view || (view.getViewType() !== "markdown" && view.getViewType() !== "empty")) return false;
    
    let rootEl = view.contentEl || view.containerEl;
    if (!rootEl) return false;
    let t = rootEl.querySelector(".floating-toc-div");
    if (!t) return false;

    let n = t.querySelector(".toolbar");
    if (!n) { n = document.createElement("div"); U(pluginInstance, n, t); t.appendChild(n); }
    
    let o = t.querySelector("ul.floating-toc");
    if (!o) { o = document.createElement("ul"); o.className = "floating-toc"; t.appendChild(o); }

    let hdgs = pluginInstance.headingdata || [];
    if (pluginInstance.settings.ignoreHeaders && hdgs.length > 0) {
        let ignored = new Set(pluginInstance.settings.ignoreHeaders.split(",").map(x => x.replace(/\D/g, "")).filter(Boolean));
        hdgs = hdgs.filter(p => !ignored.has(p.level.toString()));
    }

    let tempUl = document.createElement("ul");

    if (hdgs.length === 0) {
        let emptyLi = document.createElement("li");
        emptyLi.className = "heading-list-item empty-toc-bar";
        emptyLi.setAttribute("data-level", "1");
        
        let anc = document.createElement("div");
        anc.className = "toc-tooltip-anchor empty-anchor";
        let file = view.file || pluginInstance.app.workspace.getActiveFile();
        anc.setAttribute("aria-label", file ? "No headings available" : "No note open");
        let pos = pluginInstance.settings.positionStyle === "right" ? "left" : "right";
        anc.setAttribute("data-tooltip-position", pos);
        anc.setAttribute("aria-label-position", pos);
        
        emptyLi.appendChild(anc);
        tempUl.appendChild(emptyLi);
        
        o.innerHTML = "";
        while (tempUl.firstChild) { o.appendChild(tempUl.firstChild); }
        return true;
    }

    let s = new Map();
    t.querySelectorAll("li.heading-list-item").forEach(u => {
        if (u.classList.contains("empty-toc-bar")) return;
        let textEl = u.children[0];
        let innerText = textEl ? textEl.innerText : "";
        let p = `${u.getAttribute("data-level")}-${u.getAttribute("data-line")}-${innerText}`;
        s.set(p, u);
    });

    let c = new Set(s.values());
    hdgs.forEach((u, p) => {
        let E = `${u.level}-${u.position.start.line}-${u.heading}`;
        let y = s.get(E);
        if (y) {
            c.delete(y);
            if (R(p, pluginInstance.headingdata)) {
                if (!y.hasAttribute("iscollapsed")) y.setAttribute("isCollapsed", "false");
            } else {
                if (!y.hasAttribute("iscollapsed")) y.removeAttribute("isCollapsed");
            }
            tempUl.appendChild(y);
        } else {
            let li = document.createElement("li");
            li.className = "heading-list-item";
            li.setAttribute("data-level", u.level ? u.level.toString() : "1");
            li.setAttribute("data-id", p.toString());
            let lineVal = u.position && u.position.start ? u.position.start.line : 0;
            li.setAttribute("data-line", lineVal.toString());

            let sWrap = document.createElement("div");
            sWrap.className = "text-wrap";
            li.appendChild(sWrap);
            let path = (view && view.file) ? view.file.path : "";
            je(pluginInstance, view, u.heading, sWrap, path, null);

            let lWrap = document.createElement("div");
            lWrap.className = "line-wrap";
            let lineInner = document.createElement("div");
            lineInner.className = "line";
            lWrap.appendChild(lineInner);
            li.appendChild(lWrap);
            ke(pluginInstance, li, u, p, view);
            tempUl.appendChild(li);
        }
    });

    c.forEach(u => u.remove());
    o.innerHTML = "";
    while (tempUl.firstChild) { o.appendChild(tempUl.firstChild); }
    if (hdgs.length > 0) pluginInstance.updateTocWidth(t, hdgs);
    
    return true;
}

function Xe(i){let e=[];if(i==null?void 0:i.previousElementSibling)for(;i=i.previousElementSibling;)i.nodeType==1&&e.push(i);return e}function Je(i,e,t){if(document.body.classList.contains("is-phone"))return;var o,a,s;let n=t.target;if(((o=n.parentElement)==null?void 0:o.classList.contains("cm-editor"))||((a=n.parentElement)==null?void 0:a.classList.contains("markdown-reading-view"))){let l=i.workspace.getActiveViewOfType(T.MarkdownView);if(!l)return;let r=(s=l.currentMode.getScroll())!=null?s:0,c=e.headingdata;if(!c||c.length===0)return;let h=l.contentEl.querySelector(".floating-toc");if(!h)return;let f=h.querySelectorAll("li.heading-list-item");if(!f.length)return;let u=f[0],p=f[f.length-1],E=parseInt(u.getAttribute("data-line")||"0"),y=parseInt(p.getAttribute("data-line")||"0"),m=0,L=null;if(r<=0)m=E;else{let g=0,d=c.length-1,v=-1;for(;g<=d;){let A=Math.floor((g+d)/2);c[A].position.start.line<=r?(v=A,g=A+1):d=A-1}v!==-1?(m=c[v].position.start.line,L=c[v]):m=E}let k=h.querySelector(".heading-list-item.located");k&&k.classList.remove("located");let w=h.querySelector(`li[data-line='${m}']`);if(!w)return;w.classList.add("located");let C=parseInt(w.getAttribute("data-level")||"1"),M=C>1?C-1:1,D=h.querySelector("li.focus");D&&D.classList.remove("focus");let I=Xe(w);for(let g=0;g<I.length;g++){let d=I[g];if(d.dataset.level<=M.toString()){d.classList.add("focus");break}}requestAnimationFrame(()=>{w.scrollIntoView({block:"nearest",behavior:"smooth"})})}}

var X = class extends T.Plugin {
    constructor() {
        super(...arguments);
        this.isUpdating = false;
        this.lastRefreshTime = 0;
        this.REFRESH_COOLDOWN = 200;
        this.currentFile = null;
        this.BAR_STYLE_CLASSES = ["enable-bar-heading-text","enable-heading-nowrap","enable-content-offset","pin","hide","default-bar-style","enable-edge-style","enable-bar-icon","enable-horizontal-solid-line-style","enable-dot-style","enable-square-style","enable-vertical-line-style","enable-hollow-line-style","enable-horizontal-hollow-line-style"];
        this.updateTocWidth = (0, T.debounce)((e, t) => {
            if (!t || t.length === 0) return;
            let n = t.reduce((a, s) => {
                let r = s.heading.split("").reduce((c, h) => c + (/[\u4e00-\u9fa5]/.test(h) ? 1 : .6), 0);
                return Math.max(a, r);
            }, 0);
            let o = Math.ceil(n) + "rem";
            O.body.style.setProperty("--actual-toc-width", `${o}`);
        }, 100);
        this.handleScroll = (e, t, n) => (0, T.debounce)(Je(e, t, n), 100);
    }
    
    onload() {
        return x(this, null, function* () {
            if ((0, T.requireApiVersion)("0.15.0")) O = activeWindow.document;
            else O = window.document;
            
            yield this.loadSettings();
            this.search = new G(this);
            document.body.style.setProperty("--toc-color-1", this.settings.h1Color || "#7aa5c2");
            document.body.style.setProperty("--toc-color-2", this.settings.h2Color || "#8fb89f");
            document.body.style.setProperty("--toc-color-3", this.settings.h3Color || "#c69c6d");
            document.body.style.setProperty("--toc-color-4", this.settings.h4Color || "#a390b2");
            document.body.style.setProperty("--toc-color-5", this.settings.h5Color || "#bc7e89");
            document.body.style.setProperty("--toc-color-6", this.settings.h6Color || "#749895");
            document.body.style.setProperty("--toc-bar-multiplier", this.settings.barLength || 1);
            document.body.style.setProperty("--toc-line-thickness", (this.settings.barThickness || 2) + "px");
            document.body.setAttribute("data-toc-valign", this.settings.verticalPosition || "middle");
            
            let customStyle = document.getElementById("floating-toc-timeline-override");
            if (!customStyle) {
                customStyle = document.createElement("style");
                customStyle.id = "floating-toc-timeline-override";
                customStyle.innerHTML = "body{--toc-top-gap:120px;--toc-bottom-gap:120px}body.is-phone .floating-toc-div{display:none!important}.floating-toc-div .text,.floating-toc-div .heading-text,.floating-toc-div .line-wrap,.floating-toc-div .toolbar,.floating-toc-div .floating-toc-header,.floating-toc-div svg,.floating-toc-div [class*='collapse'],.floating-toc-div .heading-rendered::before,.floating-toc-div .heading-rendered::after{display:none!important;opacity:0!important;pointer-events:none!important}.floating-toc-div{background:0 0!important;border:none!important;box-shadow:none!important;width:max-content!important;min-width:unset!important;position:absolute!important;z-index:100!important;pointer-events:none!important;height:auto!important;max-height:80%!important}.floating-toc-div.floating-left{left:15px!important;right:auto!important}.floating-toc-div.floating-right{right:15px!important;left:auto!important}body[data-toc-valign='top'] .floating-toc-div{top:var(--toc-top-gap)!important;bottom:auto!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;max-height:calc(100% - var(--toc-top-gap))!important}body[data-toc-valign='middle'] .floating-toc-div{top:10%!important;bottom:10%!important;height:80%!important;display:flex!important;flex-direction:column!important;justify-content:center!important}body[data-toc-valign='bottom'] .floating-toc-div{top:auto!important;bottom:var(--toc-bottom-gap)!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;max-height:calc(100% - var(--toc-bottom-gap))!important}.floating-toc-div .floating-toc{background:0 0!important;width:max-content!important;pointer-events:auto!important;border:none!important;box-shadow:none!important;display:flex!important;flex-direction:column!important;padding:4px!important;margin:0!important;height:max-content!important;max-height:100%!important;overflow-y:auto!important;scrollbar-width:none!important;gap:8px!important}.floating-toc-div .floating-toc::-webkit-scrollbar{display:none!important}.floating-toc-div .heading-list-item{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:0!important;margin:0!important;background:0 0!important;border:none!important;z-index:10!important;cursor:pointer!important;flex-shrink:0!important;box-sizing:border-box!important}.floating-toc-div .text-wrap{position:absolute!important;inset:0!important;opacity:1!important;display:block!important;z-index:50!important;cursor:pointer!important;pointer-events:auto!important;background:0 0!important;margin:0!important;padding:0!important}.floating-toc-div .text-wrap *{pointer-events:none!important}.floating-toc-div .toc-tooltip-anchor{position:absolute!important;inset:-4px!important;z-index:60!important;display:block!important;cursor:pointer!important;width:auto!important;height:auto!important}.floating-toc-div .heading-list-item[data-level='1']{--lvl-w:calc(24px * var(--toc-bar-multiplier, 1));--lvl-c:var(--toc-color-1, #7aa5c2)}.floating-toc-div .heading-list-item[data-level='2']{--lvl-w:calc(20px * var(--toc-bar-multiplier, 1));--lvl-c:var(--toc-color-2, #8fb89f)}.floating-toc-div .heading-list-item[data-level='3']{--lvl-w:calc(16px * var(--toc-bar-multiplier, 1));--lvl-c:var(--toc-color-3, #c69c6d)}.floating-toc-div .heading-list-item[data-level='4']{--lvl-w:calc(12px * var(--toc-bar-multiplier, 1));--lvl-c:var(--toc-color-4, #a390b2)}.floating-toc-div .heading-list-item[data-level='5']{--lvl-w:calc(8px * var(--toc-bar-multiplier, 1));--lvl-c:var(--toc-color-5, #bc7e89)}.floating-toc-div .heading-list-item[data-level='6']{--lvl-w:calc(4px * var(--toc-bar-multiplier, 1));--lvl-c:var(--toc-color-6, #749895)}.floating-toc-div .heading-list-item.empty-toc-bar{--lvl-w:calc(24px * var(--toc-bar-multiplier, 1));--lvl-c:var(--interactive-accent, var(--color-accent, #8b6ce3))}.floating-toc-div .heading-list-item::after{content:''!important;position:absolute!important;pointer-events:none!important;display:block!important;z-index:10!important;opacity:0.4!important;transition:all 0.2s ease!important;border-radius:10px!important;box-sizing:border-box!important;background-color:var(--lvl-c)!important;border-color:var(--lvl-c)!important}.floating-toc-div .heading-list-item.empty-toc-bar::after{opacity:0.3!important}.floating-toc-div .heading-list-item:hover::after,.floating-toc-div .heading-list-item:has(.located)::after{opacity:1!important;filter:brightness(1.2)!important}body.enable-pill-container .floating-toc-div .heading-list-item::before{content:''!important;position:absolute!important;pointer-events:none!important;display:block!important;z-index:5!important;background-color:transparent!important;border-radius:10px!important;box-shadow:-1px -1px 3px rgba(255,255,255,0.08), 1px 1px 3px rgba(0,0,0,0.25)!important;box-sizing:border-box!important}body:not(.enable-vertical-line-style):not(.enable-hollow-line-style):not(.enable-horizontal-hollow-line-style) .floating-toc-div .heading-list-item,body.enable-horizontal-solid-line-style .floating-toc-div .heading-list-item{width:var(--lvl-w)!important;min-width:var(--lvl-w)!important;height:16px!important;min-height:16px!important}body:not(.enable-vertical-line-style):not(.enable-hollow-line-style):not(.enable-horizontal-hollow-line-style) .floating-toc-div .heading-list-item::after,body.enable-horizontal-solid-line-style .floating-toc-div .heading-list-item::after{width:100%!important;height:var(--toc-line-thickness, 2px)!important;border:none!important;top:50%!important;transform:translateY(-50%)!important;left:0!important}body:not(.enable-vertical-line-style):not(.enable-hollow-line-style):not(.enable-horizontal-hollow-line-style) .floating-toc-div.floating-right .heading-list-item::after,body.enable-horizontal-solid-line-style .floating-toc-div.floating-right .heading-list-item::after{left:auto!important;right:0!important}body.enable-pill-container:not(.enable-vertical-line-style):not(.enable-hollow-line-style):not(.enable-horizontal-hollow-line-style) .floating-toc-div .heading-list-item::before,body.enable-pill-container.enable-horizontal-solid-line-style .floating-toc-div .heading-list-item::before{width:calc(100% + 2px)!important;height:calc(var(--toc-line-thickness, 2px) + 2px)!important;top:50%!important;transform:translateY(-50%)!important;left:-1px!important}body.enable-pill-container:not(.enable-vertical-line-style):not(.enable-hollow-line-style):not(.enable-horizontal-hollow-line-style) .floating-toc-div.floating-right .heading-list-item::before,body.enable-pill-container.enable-horizontal-solid-line-style .floating-toc-div.floating-right .heading-list-item::before{left:auto!important;right:-1px!important}body.enable-horizontal-hollow-line-style .floating-toc-div .heading-list-item{width:var(--lvl-w)!important;min-width:var(--lvl-w)!important;height:16px!important;min-height:16px!important}body.enable-horizontal-hollow-line-style .floating-toc-div .heading-list-item::after{width:100%!important;height:calc(var(--toc-line-thickness, 2px) * 2.5)!important;background-color:transparent!important;border:1.5px solid var(--lvl-c)!important;top:50%!important;transform:translateY(-50%)!important;left:0!important}body.enable-horizontal-hollow-line-style .floating-toc-div.floating-right .heading-list-item::after{left:auto!important;right:0!important}body.enable-horizontal-hollow-line-style .floating-toc-div .heading-list-item:hover::after,body.enable-horizontal-hollow-line-style .floating-toc-div .heading-list-item:has(.located)::after,body.enable-hollow-line-style .floating-toc-div .heading-list-item:hover::after,body.enable-hollow-line-style .floating-toc-div .heading-list-item:has(.located)::after{background-color:transparent!important;box-shadow:none!important}body.enable-pill-container.enable-horizontal-hollow-line-style .floating-toc-div .heading-list-item::before{width:calc(100% + 2px)!important;height:calc((var(--toc-line-thickness, 2px) * 2.5) + 2px)!important;top:50%!important;transform:translateY(-50%)!important;left:-1px!important}body.enable-pill-container.enable-horizontal-hollow-line-style .floating-toc-div.floating-right .heading-list-item::before{left:auto!important;right:-1px!important}body.enable-vertical-line-style .floating-toc-div .heading-list-item{height:var(--lvl-w)!important;min-height:var(--lvl-w)!important;width:16px!important;min-width:16px!important}body.enable-vertical-line-style .floating-toc-div .heading-list-item::after{height:100%!important;width:var(--toc-line-thickness, 2px)!important;border:none!important;left:50%!important;transform:translateX(-50%)!important;top:0!important}body.enable-pill-container.enable-vertical-line-style .floating-toc-div .heading-list-item::before{height:calc(100% + 2px)!important;width:calc(var(--toc-line-thickness, 2px) + 2px)!important;left:50%!important;transform:translateX(-50%)!important;top:-1px!important}body.enable-hollow-line-style .floating-toc-div .heading-list-item{height:var(--lvl-w)!important;min-height:var(--lvl-w)!important;width:16px!important;min-width:16px!important}body.enable-hollow-line-style .floating-toc-div .heading-list-item::after{height:100%!important;width:calc(var(--toc-line-thickness, 2px) * 2.5)!important;background-color:transparent!important;border:1.5px solid var(--lvl-c)!important;left:50%!important;transform:translateX(-50%)!important;top:0!important}body.enable-pill-container.enable-hollow-line-style .floating-toc-div .heading-list-item::before{height:calc(100% + 2px)!important;width:calc((var(--toc-line-thickness, 2px) * 2.5) + 2px)!important;left:50%!important;transform:translateX(-50%)!important;top:-1px!important}";
                document.head.appendChild(customStyle);
            }

            let e = n => {
                if (document.body.classList.contains("is-phone")) return;
                if (n) {
                    let type = n.getViewType();
                    if (type === "markdown" || type === "empty") {
                        if (!N(this, n)) {
                            V(this.app, this, n);
                        }
                    }
                }
            };

            this.addCommand({id:"pin-toc-panel",name:"Pinning the Floating TOC panel",icon:"pin",callback:()=>{let n=this.app.workspace.getActiveViewOfType(T.MarkdownView);if(n){let o=n.contentEl.querySelector(".floating-toc-div");if(o){if(o.classList.contains("pin"))o.classList.remove("pin");else o.classList.add("pin");}}}});
            this.addCommand({id:"hide-toc-panel",name:"Hide/Show the Floating TOC panel",icon:"list",callback:()=>{let n=this.app.workspace.getActiveViewOfType(T.MarkdownView);if(n){let o=n.contentEl.querySelector(".floating-toc-div");if(o){if(o.classList.contains("hide"))o.classList.remove("hide");else o.classList.add("hide");}}}});
            this.addCommand({id:"scroll-to-bottom",name:"Scroll to Bottom",icon:"double-down-arrow-glyph",callback:()=>x(this,null,function*(){let n=this.app.workspace.getActiveViewOfType(T.MarkdownView);if(n){let o=this.app.workspace.getActiveFile();let s=(yield this.app.vault.cachedRead(o)).split(`\n`);let l=s.length;if(n.getMode()==="preview"){for(;l>0&&s[l-1].trim()==="";)l--;}n.currentMode.applyScroll(l-1);}})});
            this.addCommand({id:"scroll-to-top",name:"Scroll to Top",icon:"double-up-arrow-glyph",callback:()=>{let n=this.app.workspace.getActiveViewOfType(T.MarkdownView);if(n)n.setEphemeralState({scroll:0});}});
            this.addCommand({id:"toggle-position-style",name:"Toggle Floating TOC Position (left/right)",icon:"switch",callback:()=>{if(this.settings.positionStyle==="left")this.settings.positionStyle="right";else if(this.settings.positionStyle==="right")this.settings.positionStyle="left";else if(this.settings.positionStyle==="both")new T.Notice("Position style set to both. Toogle position only works when fixed position (left or right) is selected.");this.saveSettings();dispatchEvent(new Event("refresh-toc"));}});
            this.addCommand({id:"search-in-toc",name:"Search in Floating TOC",icon:"search",hotkeys:[{modifiers:["Alt"],key:"F"}],callback:()=>{if(this.search)this.search.startSearchFromButton();}});

            this.registerEvent(this.app.workspace.on("active-leaf-change", () => {
                setTimeout(() => {
                    let leaf = this.app.workspace.activeLeaf || this.app.workspace.getMostRecentLeaf();
                    let view = leaf ? leaf.view : null;
                    if (!view || (view.getViewType() !== "markdown" && view.getViewType() !== "empty")) return;
                    
                    let file = this.app.workspace.getActiveFile();
                    this.currentFile = file ? file.path : null;
                    
                    let cache = file ? this.app.metadataCache.getFileCache(file) : null;
                    let hdgs = cache ? cache.headings : null;
                    
                    this.headingdata = hdgs || [];
                    if (this.settings.ignoreHeaders && this.headingdata.length > 0) {
                        let ignored = this.settings.ignoreHeaders.split(",").map(x => x.replace(/\D/g, "")).filter(Boolean);
                        this.headingdata = this.headingdata.filter(u => !ignored.includes(u.level.toString()));
                    }
                    e(view);
                }, 150); 
            }));

            this.registerEvent(this.app.metadataCache.on("changed", () => {
                setTimeout(() => {
                    let leaf = this.app.workspace.activeLeaf || this.app.workspace.getMostRecentLeaf();
                    let view = leaf ? leaf.view : null;
                    if (!view || (view.getViewType() !== "markdown" && view.getViewType() !== "empty")) return;
                    if (view.getViewType() === "markdown" && view.file && view.file.path !== this.currentFile) return;
                    
                    let file = view.file || this.app.workspace.getActiveFile();
                    let cache = file ? this.app.metadataCache.getFileCache(file) : null;
                    let hdgs = cache ? cache.headings : null;
                    
                    if (!hdgs || hdgs.length === 0) {
                        this.headingdata = [];
                        e(view);
                        return;
                    }
                    
                    let s = hdgs.map(f => W(P({}, f), { heading: this.removeMarkdownSyntax(f.heading) }));
                    let l = this.headingdata ? this.headingdata.map(f => W(P({}, f), { heading: this.removeMarkdownSyntax(f.heading) })) : null;
                    
                    if (this.hasStructuralHeadingChanges(s, l)) {
                        this.headingdata = hdgs;
                        if (this.settings.ignoreHeaders) {
                            let ignored = this.settings.ignoreHeaders.split(",").map(x => x.replace(/\D/g, "")).filter(Boolean);
                            this.headingdata = this.headingdata.filter(u => !ignored.includes(u.level.toString()));
                        }
                        e(view);
                    } else {
                        this.updateOutlineLineNumbers(view, hdgs);
                    }
                }, 150);
            }));

            O.addEventListener("scroll", n => { this.handleScroll(this.app, this, n) }, !0);
            this.addSettingTab(new K(this.app, this));
            this.app.workspace.on("window-open", n => {
                n.doc.addEventListener("scroll", o => { this.handleScroll(this.app, this, o) }, !0);
            });

            this.app.workspace.onLayoutReady(() => {
                this.app.workspace.trigger("parse-style-settings");
                setTimeout(() => {
                    let leaf = this.app.workspace.activeLeaf || this.app.workspace.getMostRecentLeaf();
                    let view = leaf ? leaf.view : null;
                    if (view && (view.getViewType() === "markdown" || view.getViewType() === "empty")) {
                        e(view);
                    }
                }, 300);
            });

        });
    }

    removeMarkdownSyntax(e) {
        if (!e) return "";
        let t = e;
        t = t.replace(/\*\*(.*?)\*\*/g, "$1").replace(/__(.*?)__/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/_(.*?)_/g, "$1");
        t = t.replace(/`([^`]+)`/g, "$1").replace(/~~(.*?)~~/g, "$1");
        t = t.replace(/==(.*?)==/g, "$1");
        t = t.replace(/\[(.*?)\]\([^\)]+\)/g, "$1").replace(/\[\[(.*?)(\|.*?)?\]\]/g, "$1");
        t = t.replace(/<[^>]+>/g, "");
        t = t.replace(/^#+\s+/, "");
        return t.trim();
    }

    hasHeadingsChanged(e, t) {
        if (!t || e.length !== t.length) return !0;
        let n = a => `${a.heading}|${a.level}|${a.position.start.line}`;
        return !e.every((a, s) => {
            let l = t[s], r = n(a), c = n(l);
            return r === c;
        });
    }

    updateOutlineLineNumbers(e, t) {
        var s;
        let n = (s = e.contentEl) == null ? void 0 : s.querySelector(".floating-toc-div");
        if (!n) return;
        let o = n.querySelectorAll("li.heading-list-item");
        if (!o.length) return;
        let a = new Map;
        t.forEach(l => {
            let r = `${this.removeMarkdownSyntax(l.heading)}|${l.level}`;
            a.set(r, l.position.start.line);
        });
        o.forEach(l => {
            let r = l.getAttribute("data-level"), c = l.querySelector(".text-wrap a.text");
            if (!c) return;
            let f = `${c.innerText}|${r}`;
            if (a.has(f)) {
                let u = a.get(f);
                if (l.getAttribute("data-line") !== u.toString()) l.setAttribute("data-line", u.toString());
            }
        });
    }

    hasStructuralHeadingChanges(e, t) {
        if (!t || e.length !== t.length) return !0;
        let n = o => `${this.removeMarkdownSyntax(o.heading)}|${o.level}`;
        return e.some((o, a) => {
            let s = t[a];
            return n(o) !== n(s);
        });
    }

    onunload() {
        var e;
        if ((0, T.requireApiVersion)("0.15.0")) O = activeWindow.document;
        else O = window.document;
        
        let customStyle = document.getElementById("floating-toc-timeline-override");
        if (customStyle) customStyle.remove();
        
        try { O.removeEventListener("scroll", t => { this.handleScroll(this.app, this, t) }, !0); } 
        catch (t) { console.error("Error removing scroll event listener:", t); }
        
        try {
            let t = this.app.workspace.getActiveViewOfType(T.MarkdownView);
            if (t) {
                let n = (e = t.contentEl) == null ? void 0 : e.querySelector(".floating-toc-div");
                if (n) {
                    n.querySelectorAll("li.heading-list-item").forEach(a => {
                        let s = a.cloneNode(!0);
                        if (a.parentNode) a.parentNode.replaceChild(s, a);
                    });
                    if (n._tocCleanup) n._tocCleanup();
                }
            }
        } catch (t) { console.error("Error cleaning up resources:", t); }
        F();
    }

    setHeadingdata(e) { this.headingdata = e || []; }
    
    loadSettings() {
        return x(this, null, function* () {
            this.settings = Object.assign({}, Oe, yield this.loadData());
        });
    }
    
    saveSettings() {
        return x(this, null, function* () {
            yield this.saveData(this.settings);
        });
    }
}
