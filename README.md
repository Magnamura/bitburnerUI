# Bitburner Custom UI Lib by Magnamura

Diese Library erlaubt es, saubere Fenster, Tabellen und Progressbars direkt im `tail`-Log von Bitburner anzuzeigen. Das Design ist im klassischen Terminal-Look gehalten.

## Installation

1. Speicher den Code als `ui-lib.js` auf deinem Home-Server.
2. In deinem Main-Script importierst du die Library:

```javascript
import { UI } from "ui-lib.js";
```

## Schnelleinstieg (Beispiel)

Hier ist ein einfaches Beispiel, wie du ein Fenster mit einer Tabelle und einem Balken erstellst:

```javascript
import { UI } from "ui-lib.js";
/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();

    // 1. Fenster anlegen (Breite: 60)
    const win = new UI.Window("SERVER MONITOR v1.0", 60);

    while (true) {
        win.clear(); // Alten Content löschen

        // 2. Eine Tabelle hinzufügen
        const table = new UI.Table([
            { header: "Server", width: 15 },
            { header: "RAM",    width: 10, align: 'right' },
            { header: "Status", width: 15 }
        ]);
        table.addRow(["home", "128GB", "OK"]);
        table.addRow(["n00dles", "4GB", "HACKING"]);
        
        win.add(table);
        win.add(""); // Leerzeile für die Optik

        // 3. Progress Bar hinzufügen
        const ramBar = new UI.ProgressBar("Total RAM Usage", 40, 100);
        win.add(ramBar);

        // 4. Zeichnen und Autoresize
        win.render(ns);
        win.autoResize(ns);

        await ns.sleep(1000);
    }
}
```

## Komponenten

### `UI.Window(title, width)`
Der Hauptcontainer. Sorgt für den Rahmen und den Titel.
- `add(element)`: Fügt einen String oder eine Komponente (Table/ProgressBar) hinzu.
- `render(ns)`: Zeichnet das Fenster in das Log.
- `autoResize(ns)`: Passt die Fenstergröße des Tail-Logs automatisch an den Inhalt an.

### `UI.Table(columns)`
Erstellt eine formatierte Tabelle.
- `columns`: Ein Array aus Objekten: `{ header: "Name", width: 10, align: 'left' }`.
- `addRow(data)`: Ein Array mit Werten für die Spalten.

### `UI.ProgressBar(label, current, max)`
Ein visueller Balken.
- Die Farbe wechselt automatisch auf **Rot**, wenn der Fortschritt unter 20% liegt, ansonsten ist er **Grün**.