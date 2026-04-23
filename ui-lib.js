/** @param {NS} ns **/
export const UI = {
    Color: {
        Red: "\u001b[31m",
        Green: "\u001b[32m",
        Cyan: "\u001b[36m",
        Yellow: "\u001b[33m",
        Default: "\u001b[32m", // Matrix-Grün
        Reset: "\u001b[0m",
        Invisible: "\u200b"
    },

    _visibleLen: (str) => str.toString().replace(/\u001b\[\d+m/g, "").length,

    // NEU: Unterstützt jetzt 'left' und 'right' Alignment
    _forceWidth: (str, width, align = 'left') => {
        const text = str.toString();
        const vLen = UI._visibleLen(text);
        const R = UI.Color.Reset;
        const D = UI.Color.Default;
        const pad = " ".repeat(Math.max(0, width - vLen));
        
        let content = text;
        if (vLen > width) content = text.substring(0, width);

        if (align === 'right') {
            // Rechtsbündig: Erst Leerzeichen, dann der (grüne) Text
            return R + pad + D + content + R;
        } else {
            // Linksbündig: Erst der (grüne) Text, dann Leerzeichen
            return D + content + R + pad + R;
        }
    },

    Window: class {
        constructor(title, width = 50) {
            this.title = title;
            this.width = width;
            this.elements = [];
            this.lastRowCount = 0;
            this.lastTitle = ""; // Speichert den aktuellen Titel im UI
        }
        
        clear() { this.elements = []; }
        add(el) { this.elements.push(el); }

        render(ns) {
            // OPTIMIERUNG 1: Titel-Update nur bei Änderung
            if (this.title !== this.lastTitle) {
                ns.ui.setTailTitle(this.title);
                this.lastTitle = this.title;
            }

            const innerW = this.width - 4; 
            const R = UI.Color.Reset;
            const I = UI.Color.Invisible;
            
            // OPTIMIERUNG 2: Buffering. Wir sammeln alles in einem Array
            let buffer = [];
            buffer.push(`${I}${R}┌${"─".repeat(this.width - 2)}┐${R}`);
            
            for (let el of this.elements) {
                if (el && typeof el.render === 'function') {
                    const rows = el.render(innerW);
                    rows.forEach(r => buffer.push(`${I}${R}│ ${UI._forceWidth(r, innerW, 'left')}${R} │${R}`));
                } else {
                    buffer.push(`${I}${R}│ ${UI._forceWidth(el || "", innerW, 'left')}${R} │${R}`);
                }
            }
            buffer.push(`${I}${R}└${"─".repeat(this.width - 2)}┘${R}`);

            // Erst am Ende: Einmal löschen, einmal drucken.
            ns.clearLog();
            ns.print(buffer.join("\n")); 
        }

        autoResize(ns) {
            let currentRowCount = 2; 
            for (let el of this.elements) {
                if (el && typeof el.render === 'function') {
                    currentRowCount += el.render(this.width - 4).length;
                } else { currentRowCount += 1; }
            }
            
            // OPTIMIERUNG 3: Sehr toleranter Resize-Check
            // Wir erlauben eine kleine Abweichung, bevor wir das UI stressen
            if (Math.abs(currentRowCount - this.lastRowCount) > 0.1) {
                ns.ui.resizeTail(this.width * 9.7, (currentRowCount * 25.4) + 20);
                this.lastRowCount = currentRowCount;
            }
        }
    },

    Table: class {
        constructor(columns) {
            this.columns = columns; // Jede Column kann nun {header, width, align} haben
            this.rows = [];
        }
        addRow(data) { this.rows.push(data); }
        render(totalWidth) {
            let output = [];
            const R = UI.Color.Reset;
            const D = UI.Color.Default;
            
            // Header immer linksbündig für die Optik, oder wie definiert
            let head = this.columns.map(c => UI._forceWidth(c.header, c.width, c.align || 'left')).join(`${R} │ ${D}`);
            output.push(head);
            
            let sep = this.columns.map(c => "─".repeat(c.width)).join("─┼─");
            output.push(R + sep + R);

            for (let row of this.rows) {
                let r = this.columns.map((c, i) => {
                    // Hier wird das Alignment der Spalte angewendet!
                    return UI._forceWidth(row[i] || "", c.width, c.align || 'left');
                }).join(`${R} │ ${D}`);
                output.push(r);
            }
            return output;
        }
    },

    ProgressBar: class {
        constructor(label, current, max) {
            this.label = label;
            this.pct = Math.max(0, Math.min(1, current / max || 0));
        }
        render(totalWidth) {
            const barWidth = 20;
            const pctStr = (this.pct * 100).toFixed(1) + "%";
            const labelWidth = totalWidth - barWidth - 10; 
            const filled = Math.floor(this.pct * barWidth);
            const R = UI.Color.Reset;
            const color = this.pct < 0.2 ? UI.Color.Red : UI.Color.Green;
            const bar = `${color}${"█".repeat(filled)}${R}${"░".repeat(barWidth - filled)}${R}`;
            return [`${this.label.padEnd(labelWidth)} [${bar}] ${pctStr.padStart(6)}`];
        }
    }
};
