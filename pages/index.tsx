import { useState, useEffect } from "react";
import { Item, Sale } from "../types/types";
import { Keypad } from "../components/Keypad";

const sampleItems: Item[] = [
  {id:"1", name:"プレーン", price:300, cost:107.6},
  {id:"2", name:"にんにくみそ", price:400, cost:111.8},
  {id:"3", name:"豆板醤", price:400, cost:108.7},
  {id:"4", name:"バジル", price:400, cost:115.6},
  {id:"5", name:"大盛り", price:100, cost:25}
];

export default function Home() {
  const [cart, setCart] = useState<Item[]>([]);
  const [input, setInput] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("sales");
    if(stored) setSales(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const total = cart.reduce((sum,i)=>sum+i.price,0);

  const confirmSale = () => {
    const payment = parseInt(input||"0",10);
    if(payment>=total){
      const sale: Sale = { date: new Date().toISOString(), items: cart, total, payment, change: payment-total };
      setSales([...sales, sale]);
      setCart([]);
      setInput("");
    } else {
      alert("支払い不足です");
    }
  };

  return (
    <div style={{padding:20}}>
      <h1>iPad POS (Web)</h1>

      <div style={{display:"flex", gap:12, marginBottom:12}}>
        {sampleItems.map(i=>(
          <button key={i.id} style={{width:160,height:80}} onClick={()=>setCart([...cart,i])}>
            <div>{i.name}</div>
            <div>¥{i.price}</div>
          </button>
        ))}
      </div>

      <h2>カート</h2>
      <ul>
        {cart.map((c,idx)=><li key={idx}>{c.name} ¥{c.price}</li>)}
      </ul>

      <h2>合計: ¥{total}</h2>

      <Keypad input={input} setInput={setInput} onConfirm={confirmSale} />

      <div style={{marginTop:12}}>預かり: ¥{input}</div>

      <hr/>
      <a href="/summary">日別集計を見る</a>
    </div>
  );
}
