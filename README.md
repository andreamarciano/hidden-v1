# 🔠 Hidden Word Trash Collector - React + Context API

This project implements a playful animation system where discarded letters "fall" into a trash bin and gradually reveal a **hidden word** through **negative space**. As users interact with different components, letters are collected and visually scattered — **avoiding specific masked areas** that form the contours of a secret word.

Currently, the word **"HIDE5"** is being revealed.

> **Technologies used**:
> **React**, **Context API**, **Tailwind CSS**, **Custom CSS Animations** (fall, tilt)

---

## 🧩 Overview

The system consists of:

- **Interactive Components**: These components are designed to **extract text** and send it to the trash system. Each one offers a different animation or interaction, but they all contribute letters to the central collector.
  Currently implemented components include:

  - **`FallingDiv`**: A component that simulates a paper held by two pins. When one pin is removed, it swings and then falls. Its text content is extracted and sent to the trash.

  - **`MeltingDiv`**: A heat-reactive block. When the user hovers over it, the component gradually "heats up". If hovered for 5 seconds, it begins to melt, releasing steam, dripping colored chunks, and finally disappearing — at which point its text is extracted and sent to the trash.

- `TrashBin`: A bouncing trash can icon. Clicking it dumps the collected letters into the **TrashCollector**.
- `TrashCollector`: The visual "floor" where letters scatter — but intentionally **avoid** certain areas, leaving a negative-space outline of a word.
- `TrashContext`: Centralized state using **React Context API** to manage all letters in motion or dumped.

---

## ⚙️ How It Works

### 1. **Adding Letters to the Bin**

Components like `FallingDiv` extract their inner text and send it to the `TrashContext`:

```js
addToTrash("some letters");
```

This populates the `pendingLetters` array.

---

### 2. **Dumping the Bin**

Clicking the `TrashBin` triggers an animation and a timed call to `dumpTrash()`:

```js
setTimeout(() => {
  setDumpedLetters((prev) => [...prev, ...letterData]);
  setFallingLetters([]);
  setPendingLetters([]);
}, 800);
```

The dump triggers a scatter effect — but with **masked areas excluded**.

---

### 3. **Masking Logic**

To reveal a word like "HIDE5", specific regions are **excluded** from letter placement.

In `TrashContext`, we define geometric masks like:

```js
const isInHMask = (x, y) => {
  const leftColumn = x >= 2 && x <= 6;
  const rightColumn = x >= 22 && x <= 26;
  const centerBar = y >= 40 && y <= 54 && x >= 6 && x <= 22;
  return leftColumn || rightColumn || centerBar;
};
```

Letter positions are generated **outside** all letter masks:

```js
do {
  x = Math.random() * 100;
  y = Math.random() * 100;
} while (isInAnyMask(x, y));
```

As more letters fall, the masked areas remain empty, and the secret word **emerges visually**.

---

## Components Breakdown

### `FallingDiv.jsx`

- Click a pin → swing animation → fall → extract text.
- Adds text to trash automatically when falling.

### `MeltingDiv.jsx`

- On mouse hover, gradually increases "heat level" with a smooth color transition from yellow to red.
- If hovered continuously for 5 seconds, triggers the melting phase.
- During melting, the div visually "melts": it shakes, drips colored chunks, emits steam particles, and slowly disappears.
- After melting animation completes (~2 seconds), extracts its text content and adds it to the trash context.
- Plays looping lava bubbling sound while heating and one-shot sounds for melting and steam effects.
- If mouse leaves before melting threshold, the heat level decreases gradually and the div "cools down."

### 🗑️ `TrashBin.jsx`

- Bounces when it contains letters.
- Tilts and opens when clicked.
- Triggers dump animation and disperses letters.

### `TrashCollector.jsx`

- Letters scatter into random positions, avoiding masked zones.
- Visual output where the hidden word appears through negative space.

### `TrashContext.jsx`

- Holds global letter state:

  - `pendingLetters`: waiting in bin
  - `fallingLetters`: currently falling
  - `dumpedLetters`: placed on floor

- Responsible for applying mask exclusion logic.

---

## ➕ Extending the System

You can easily add new divs that inject letters into the system using the addToTrash() function from context:

```js
const { addToTrash } = useTrash();
addToTrash("new content");
```

---

## Dev Notes

- All coordinates for masks use percentages (`0–100%`) for responsive scaling.
- Falling animations are handled via CSS (`FallingDiv.css`, `TrashBin.css`).
- Letter positioning is randomized but avoids masked zones using `do...while`.
- A `DebugMask` component is available to visually preview the letter masks.

## Getting Started

To run the project locally:

```bash
git clone https://github.com/andreamarciano/hidden-v1
cd hidden-v1
npm install
npm run dev
```
