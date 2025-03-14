"use client";

import { useState, useRef, useEffect } from "react";

import styles from "./page.module.css";

const ROWS = 100;
const COLORS = ["red", "yellow", "blue", "purple", "orange"];

export default function Home() {
  const [coloredCells, setColoredCells] = useState({});
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, cell: null });
  const [principalColor, setPrincipalColor] = useState('red');
  const [screenHeight, setScreenHeight] = useState(0);
  const tempCells = useRef(new Set());
  const clickedMouseDown = useRef(false);

  useEffect(() => {
    if (window === 'undefined') return;

    setScreenHeight(window.innerHeight);
  }, []);

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
    clickedMouseDown.current = false;
  };

  const selectColor = (color) => {
    clickedMouseDown.current = false;
    if (contextMenu.cell !== null) {
      handleClick(contextMenu.cell, color);
      setContextMenu({ visible: false, x: 0, y: 0, cell: null });
    }
  };

  const handleMouseDown = (idx) => {
    tempCells.current.clear();
    clickedMouseDown.current = true;
  };

  const handleMouseUp = () => {
    for (const cell of tempCells.current) {
      handleClick(cell, principalColor);
    }
    clickedMouseDown.current = false;
  };

  const handleMouseOver = (idx) => {
    if (clickedMouseDown.current) handleClick(idx, principalColor);
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
          onMouseUp={handleMouseUp}
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
