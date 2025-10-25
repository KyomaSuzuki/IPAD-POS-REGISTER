import { useEffect, useState } from "react";
import { Sale } from "../types/types";

export default function Summary() {
  const [sales, setSales] = useState<Sale[]>([]);
  const fixedCost = 500;

  useEffect(()=>{
    const stored = localStorage.getItem("sales");
    if(stored) setSales(JSON.parse(stored));
  }, []);

  const grouped: {[key:string]: Sale[]} = {};
  sales.forEach(s=>{
    const day = s.date.slice(0,10);
    if(!grouped[day]) grouped[day]=[];
    grouped[day].push(s);
  });

  return (
    <div style={{padding:20}}>
      <h1>日別集計</h1>
      {Object.entries(grouped).map(([day, daySales])=>(
        <div key={day} style={{marginBottom:12}}>
          <h3>{day}</h3>
          <div>売上: ¥{daySales.reduce((sum,s)=>sum+s.total,0)}</div>
          <div>純利益(簡易): ¥{daySales.reduce((sum,s)=>sum+s.total,0)-fixedCost}</div>
        </div>
      ))}
      <a href="/">戻る</a>
    </div>
  );
}
