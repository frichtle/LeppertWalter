# Walter Leppert – Stadtführungen Schorndorf

Moderne, minimalistische Web-Präsenz für die historischen Gottlieb-Daimler-Stadtführungen mit Walter Leppert in Schorndorf.

## Enthaltene Inhalte & Funktionen

- **Gottlieb-Daimler-Führung & Gruppenangebote**: Detaillierte Tourinformationen, Stationen und Ablauf.
- **Impressionen (527 Original-Fotos)**: Vollständiges Fotoarchiv von `levents.eu/impressionen` mit schneller Paginierung und Lightbox-Ansicht.
- **Gästebuch (110 Original-Bewertungen)**: Vollständige Sammlung seit 2016 mit Suchfunktion und Feedback-Formular.
- **Direktkontakt & Terminanfrage**: Schlankes Formular mit direkter Weiterleitung an `walter.leppert@aol.com`.
- **Modernes, schlankes Design**: Gestaltet in harmonischen Blau- und Schiefergrautönen (Tailwind CSS).

---

## Automatisches Deployment auf GitHub Pages

Dieses Projekt ist vorkonfiguriert für **GitHub Pages** mit automatischem GitHub Actions Workflow (`.github/workflows/deploy.yml`).

### So aktivieren Sie GitHub Pages im GitHub Repository:

1. Laden Sie das Projekt in Ihr GitHub-Repository hoch (über **Export to GitHub** in AI Studio oder via `git push`).
2. Öffnen Sie Ihr Repository auf GitHub und klicken Sie auf **Settings** (Einstellungen).
3. Wählen Sie im linken Menü **Pages**.
4. Unter **Build and deployment** -> **Source** wählen Sie:
   👉 **„GitHub Actions“** (nicht „Deploy from a branch“).
5. Das war's! Sobald Sie Code pushen, baut GitHub die Seite automatisch und stellt sie unter `https://<ihr-benutzername>.github.io/<repo-name>/` live zur Verfügung.

---

## Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (Port 3000)
npm run dev

# Produktions-Build erstellen
npm run build
```
