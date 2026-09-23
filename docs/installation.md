# 📑 React.js & Tailwind CSS Handmatige Installatie Handleiding

> Deze handleiding beschrijft de oorspronkelijke frontend-installatie. Voor de Node.js-backend, MongoDB Atlas, REST API, Thunder Client-tests en opgeloste serverproblemen, zie [server-setup.md](server-setup.md), [server-statement-of-work.md](server-statement-of-work.md) en [server-errors-solved.md](server-errors-solved.md).

Deze handleiding legt stap voor stap uit hoe je vanaf nul een schone **React.js (Vite) Single Page Application** opzet met **Tailwind CSS**, volledig geïnstalleerd op de **G-schijf** om de C-schijf schoon te houden.

---

## 🚀 Deel 1: Project Aanmaken & Downloads (Terminal)

Sluit alle actieve terminals en open een splinternieuwe **Command Prompt (CMD)** of **PowerShell**.

### 1. Navigeren naar de G-schijf

Schakel over naar de lokale G-schijf en ga naar je centrale projectenmap (waar ook de map `mappapp` staat):

```bash
G:
cd Projects
```

### 2. De React (Vite) Basis Installeren

Maak de nieuwe projectmap aan en installeer de React-bestanden:

```bash
npm create vite@latest yw-vineyard-tracker -- --template react
cd yw-vineyard-tracker
```

### 3. Core Pakketten & Tailwind Downloaden

Download alle benodigde code-pakketten rechtstreeks naar de G-schijf:

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
```

---

## 🛠️ Deel 2: Handmatige Configuratie (Windows Verkenner)

Als automatische terminal-opdrachten (zoals `npx tailwindcss init`) haperen, configureren we de bestanden handmatig in de hoofdmap van je project:

### 1. `tailwind.config.js` Aanmaken

1. Klik met de rechtermuisknop in de hoofdmap ➔ **Nieuw** ➔ **Tekstdocument**.
2. Noem het bestand exact: `tailwind.config.js` _(verwijder de `.txt` extensie)_.
3. Open het bestand en plak deze code erin:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 2. `postcss.config.js` Aanmaken

1. Klik met de rechtermuisknop in de hoofdmap ➔ **Nieuw** ➔ **Tekstdocument**.
2. Noem het bestand exact: `postcss.config.js` _(verwijder de `.txt` extensie)_.
3. Open het bestand en plak deze code erin:

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## 📂 Deel 3: Mappen & CSS Opschonen (Binnen de `src/` map)

Dubbelklik op de map **`src`** om de interne applicatiestructuur in te richten:

### 1. Submappen Aanmaken

Klik met de rechtermuisknop op een lege plek ➔ **Nieuw** ➔ **Map** en maak deze twee mappen aan:

- `components` _(voor alle UI-schermen)_
- `context` _(voor de globale game-state logica)_

### 2. Standaard CSS Schoonmaken

1.  Open het bestand **`src/index.css`**, wis alle bestaande tekst volledig, en plak de Tailwind-richtlijnen erin:

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    body {
      background-color: #0c0a09; /* Stone-950 donkere achtergrond */
      color: #f5f5f4; /* Stone-100 lichte tekst */
    }
    ```

2.  Open het bestand **`src/App.css`**, **wis alle tekst** zodat het een volledig leeg bestand wordt, en sla het op. Dit voorkomt dat oude Vite-stijlen je Tailwind-ontwerp verpesten.

---

## ⚡ Deel 4: Applicatie Starten & Testen

Ga terug naar je terminal (die nog open staat in `G:\Projects\yw-vineyard-tracker`) en voer het startcommando uit:

```bash
npm run dev
```

Open de getoonde link (meestal `http://localhost:5173/`) in je browser. De app draait nu met een schone, donkere achtergrond en een volledig functionele Tailwind CSS-motor op je G-schijf!
