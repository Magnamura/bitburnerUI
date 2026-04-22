# Sicherheitsrichtlinien (Security Policy)

## Unterstützte Versionen

Derzeit werden Sicherheitsupdates nur für die aktuellste Version im `master`-Branch bereitgestellt.

| Version | Unterstützt |
| ------- | ----------- |
| Aktuell (`master`) | ✅ Ja |
| < 1.0.0 | ❌ Nein |

## Meldung einer Sicherheitslücke

Wenn du eine Sicherheitslücke entdeckst (z.B. eine Möglichkeit für XSS im Spiel-Log oder ungewollte Datenübertragung), melde diese bitte direkt an uns.

Um die Sicherheit der Nutzer zu gewährleisten, bitten wir dich:
1. **Kein öffentliches Issue** für die Sicherheitslücke zu erstellen.
2. Kontaktiere den Maintainer über GitHub (per Private Message oder, falls hinterlegt, per E-Mail).
3. Gib uns angemessene Zeit, das Problem zu beheben, bevor du Informationen darüber veröffentlichst.

## Grundsätze für bitburnerUI

Da diese Library innerhalb der Bitburner-Umgebung (Webbrowser/Steam) läuft, folgen wir diesen Prinzipien:

1. **Keine externen Anfragen:** Die Library tätigt von sich aus keine `fetch`- oder API-Anfragen nach außen.
2. **Datenintegrität:** Wir manipulieren nur das `tail`-Log-Fenster von Bitburner und greifen nicht auf andere Teile des Browsers oder des lokalen Dateisystems zu.
3. **XSS-Schutz:** Wir bemühen uns, Eingaben in Tabellen und Fenstern so zu verarbeiten, dass kein bösartiger Code ausgeführt werden kann.

## Disclaimer

Dieses Projekt ist eine Fan-Erweiterung für das Spiel Bitburner. Die Nutzung erfolgt auf eigene Gefahr. Wir übernehmen keine Haftung für verlorene Spielstände oder Probleme, die durch die Modifikation der Spiel-UI entstehen.
