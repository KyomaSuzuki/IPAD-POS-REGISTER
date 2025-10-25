import React from "react";

type KeypadProps = {
  input: string;
  setInput: (val: string) => void;
  onConfirm: () => void;
};

const keys = ["1","2","3","4","5","6","7","8","9","C","0","OK"];

export const Keypad: React.FC<KeypadProps> = ({ input, setInput, onConfirm }) => {
  const handleClick = (k: string) => {
    if(k==="C") setInput("");
    else if(k==="OK") onConfirm();
    else setInput(input + k);
  };

  return (
    <div style={{display:"grid", gridTemplateColumns:"repeat(3,80px)", gap:8}}>
      {keys.map(k => (
        <button key={k} style={{height:60}} onClick={()=>handleClick(k)}>{k}</button>
      ))}
    </div>
  );
};
