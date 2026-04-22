/** @param {NS} ns **/
// Zentrales UI-Modul für Bitburner - sorgt für ein einheitliches Terminal-Design
export const UI = {
    Color: {
        Red: "\u001b[31m",
        Green: "\u001b[32m",
        Cyan: "\u001b[36m",
        Yellow: "\u001b[33m",
        Default: "\u001b[32m", // Das klassische Matrix-Grün
        Reset: "\u001b[0m",
        Invisible: "\u200b" // Hilft gegen seltsame Zeilenumbrüche im Log
    },

    // Filtert ANSI-Farbcodes raus, um die echte Textlänge für das Padding zu kriegen
    _visibleLen: (str) => str.toString().replace(/\u001b\[\d+m/g, "").length,

    // Sorgt dafür, dass ein String genau X Zeichen breit ist (mit Padding/Alignment)
    _forceWidth: (str, width, align = 'left') => {
        const text = str.toString();
        const vLen = UI._visibleLen(text);
        const R = UI.Color.Reset;
        const D = UI.Color.Default;
        const pad = " ".repeat(Math.max(0, width - vLen));
        
        let content = text;
        if (vLen > width) content = text.substring(0, width);

        if (align === 'right') {
            return R + pad + D + content + R; // Rechtsbündig
        } else {
            return D + content + R + pad + R; // Linksbündig (Standard)
        }
    },

    // Die Hauptbox für das Tail-Window
    Window: class {
        constructor(title, width = 50) {
            this.title = title;
            this.width = width;
            this.elements = [];
            this.lastRowCount = 0; // Für Resize-Check
        }
        
        clear() { this.elements = []; }
        add(el) { this.elements.push(el); }

        render(ns) {
            ns.clearLog();
            const innerW = this.width - 4; 
            const R = UI.Color.Reset;
            const I = UI.Color.Invisible;

            // Header zeichnen
            ns.print(`${I}${R}┌${"─".repeat(this.width - 2)}┐${R}`);
            ns.print(`${I}${R}│ ${UI._forceWidth(this.title, innerW, 'left')}${R} │${R}`);
            ns.print(`${I}${R}├${"─".repeat(this.width - 2)}┤${R}`);
            
            // Content-Loop
            for (let el of this.elements) {
                if (el && typeof el.render === 'function') {
                    const rows = el.render(innerW);
                    rows.forEach(r => ns.print(`${I}${R}│ ${UI._forceWidth(r, innerW, 'left')}${R} │${R}`));
                } else {
                    // Falls nur ein einfacher String übergeben wurde
                    ns.print(`${I}${R}│ ${UI._forceWidth(el || "", innerW, 'left')}${R} │${R}`);
                }
            }
            // Footer
            ns.print(`${I}${R}└${"─".repeat(this.width - 2)}┘${R}`);
        }

        // Passt das Tail-Fenster automatisch an die Anzahl der Zeilen an (fummelig!)
        autoResize(ns) {
            let currentRowCount = 4; // Header/Footer Basis
            for (let el of this.elements) {
                if (el && typeof el.render === 'function') {
                    currentRowCount += el.render(this.width - 4).length;
                } else { currentRowCount += 1; }
            }
            // Nur resizen wenn nötig, spart Performance
            if (currentRowCount !== this.lastRowCount) {
                ns.ui.resizeTail(this.width * 9.7, currentRowCount * 25 + 10);
                this.lastRowCount = currentRowCount;
            }
        }
    },

    // Tabellen-Komponente mit Spalten-Support
    Table: class {
        constructor(columns) {
            this.columns = columns; // Format: {header, width, align}
            this.rows = [];
        }
        addRow(data) { this.rows.push(data); }
        
        render(totalWidth) {
            let output = [];
            const R = UI.Color.Reset;
            const D = UI.Color.Default;
            
            // Header-Zeile bauen
            let head = this.columns.map(c => UI._forceWidth(c.header, c.width, c.align || 'left')).join(`${R} │ ${D}`);
            output.push(head);
            
            // Trennlinie
            let sep = this.columns.map(c => "─".repeat(c.width)).join("─┼─");
            output.push(R + sep + R);

            // Daten-Zeilen
            for (let row of this.rows) {
                let r = this.columns.map((c, i) => {
                    return UI._forceWidth(row[i] || "", c.width, c.align || 'left');
                }).join(`${R} │ ${D}`);
                output.push(r);
            }
            return output;
        }
    },

    // Fortschrittsbalken (ändert Farbe bei niedrigem Wert)
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
            
            // Visuelles Feedback: Rot bei kritischen Werten (<20%)
            const color = this.pct < 0.2 ? UI.Color.Red : UI.Color.Green;
            const bar = `${color}${"█".repeat(filled)}${R}${"░".repeat(barWidth - filled)}${R}`;
            
            return [`${this.label.padEnd(labelWidth)} [${bar}] ${pctStr.padStart(6)}`];
        }
    }
};