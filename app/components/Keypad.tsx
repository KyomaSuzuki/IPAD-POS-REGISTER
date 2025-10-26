// app/components/Keypad.tsx
"use client";
import React from "react";

export default function Keypad({ onPress }: { onPress: (k: string) => void }) {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["C", "0", "OK"],
  ];

  return (
    <div className="keypad">
      {keys.map((row, r) => (
        <div key={r} className="key-row">
          {row.map(k => (
            <button
              key={k}
              className={`key ${k === "C" ? "key-clear" : k === "OK" ? "key-ok" : ""}`}
              onClick={() => onPress(k)}
            >
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
