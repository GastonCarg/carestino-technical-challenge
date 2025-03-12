"use client";

import { useState } from "react";

import styles from "./page.module.css";

const ROWS = 100;
const COLORS = ["red", "yellow", "blue", "purple", "orange"];

export default function Home() {
  const [coloredCells, setColoredCells] = useState({});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, cell: null });
  const [principalColor, setPrincipalColor] = useState('red');
  const [clickedMouseDown, setClickedMouseDown] = useState(false);
  const [listCellToColor, setListCellToColor] = useState(new Set());

  const screenHeight = typeof window !== undefined ? window.innerHeight : 0;

  const handleClick = (cell, color) => {
    setPrincipalColor(color);
    setColoredCells((prevState) => ({
      ...prevState,
      [cell]: prevState[cell] === color ? 'white' : color,
    }));
  };

  const handleRightClick = (event, cell) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY, cell });
  };

  const selectColor = (color) => {
    if (contextMenu.cell !== null) {
      handleClick(contextMenu.cell, color);
      setContextMenu({ visible: false, x: 0, y: 0, cell: null });
    }
  };

  const handleMouseDown = (idx) => {
    handleClick(idx, principalColor);
    setClickedMouseDown(true);
  };

  const handleMouseUp = (idx) => {
    handleClick(idx, principalColor);
    setClickedMouseDown(false);

    listCellToColor.map((cell) => {
      handleClick(cell, principalColor);
    });

    setListCellToColor([]);
  };

  const handleMouseOver = (idx) => {
    if (!clickedMouseDown) return;

    setListCellToColor(prevState => {
      const newSet = new Set(prevState);
      if (newSet.has(idx)) return prevState;

      newSet.add(idx);
      return Array.from(newSet);
    });
  };

  return (
    <div className={styles.container}>
      {Array.from({ length: ROWS * screenHeight / 13 }, (_, idx) => (
        <section
          key={idx}
          className={styles.cell}
          onClick={() => handleClick(idx, principalColor)}
          onContextMenu={(event) => handleRightClick(event, idx)}
          style={{ backgroundColor: coloredCells[idx] || "white" }}
          onMouseDown={() => handleMouseDown(idx)}
          onMouseOver={() => handleMouseOver(idx)}
          onMouseUp={() => handleMouseUp(idx)}
        ></section>
      ))}

      {contextMenu.visible && (
        <div
          className={styles.colorpicker}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {
            COLORS.map((color) => (
              <div
                key={color}
                className={styles.coloroption}
                style={{ backgroundColor: color }}
                onClick={() => selectColor(color)}
              ></div>
            ))
          }
        </div>
      )}
    </div>
  );
}
