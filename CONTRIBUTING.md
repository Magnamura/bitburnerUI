# Mitwirken an bitburnerUI

Vielen Dank, dass du helfen möchtest, die UI-Library für Bitburner zu verbessern! Da Bitburner eine aktive Coding-Community hat, sind neue Komponenten oder Optimierungen immer willkommen.

## Wie du beitragen kannst

### 1. Neue UI-Komponenten hinzufügen
Hast du eine Idee für eine neue Komponente (z. B. ein Graph, ein Status-Indikator oder eine Log-Box)? 
* Erstelle bitte zuerst ein Issue, um das Design zu besprechen.
* Achte darauf, dass neue Komponenten die bestehende Syntax verwenden (`new UI.Component(...)`).
* Die Komponenten sollten den Terminal-Look (ASCII-Art / Box-Drawing characters) beibehalten.

### 2. Fehlerbehebungen (Bug Fixes)
Falls du einen Fehler in der Darstellung oder beim `autoResize` findest:
* Beschreibe im Issue genau, wie dein `tail`-Fenster konfiguriert war.
* Ein Screenshot des Fehlverhaltens hilft enorm!

### 3. Performance-Optimierungen
Da Scripte in Bitburner oft in einer `while(true)`-Schleife laufen, ist effizienter Code wichtig. Wenn du Wege findest, das Rendering zu beschleunigen oder den RAM-Verbrauch der Library (aktuell sehr gering) zu halten, freuen wir uns über einen Pull Request.

## Entwicklungs-Richtlinien

### Code-Stil
* **Sprache:** JavaScript (ES6+).
* **Formatierung:** Nutze 4 Leerzeichen für Einrückungen (passend zum aktuellen Code).
* **Dokumentation:** Nutze JSDoc-Kommentare (`/** @param {NS} ns */`), damit die Autovervollständigung in Bitburner (und VS Code) funktioniert.

### Testing im Spiel
Da diese Library direkt die `ns`-API nutzt, müssen Änderungen in Bitburner getestet werden:
1. Kopiere deine Änderungen in eine Datei (z. B. `ui-lib-dev.js`) auf deinem In-Game Server.
2. Erstelle ein Test-Script, das alle Komponenten (Table, Window, ProgressBar) gleichzeitig rendert.
3. Überprüfe, ob das `tail`-Log korrekt skaliert und keine Artefakte anzeigt.

## Pull Request Prozess
1. Forke das Repository.
2. Erstelle einen Feature-Branch (`git checkout -b feature/neue-komponente`).
3. Committe deine Änderungen.
4. Öffne einen Pull Request und beschreibe kurz, was geändert wurde und wie man es testen kann.

---

Vielen Dank für deine Unterstützung beim Bauen von besseren Bitburner-Interfaces! 🚀
