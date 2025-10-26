// app/components/ProductList.tsx
"use client";
import React from "react";

export default function ProductList({ onAdd }: { onAdd: (p: { id: string; name: string; price: number; cost: number }) => void }) {
  // 4種類（ベース + トッピングで表現）
  const products = [
    { id: "p1", name: "ベースA + トッピング1", price: 400, cost: 200 },
    { id: "p2", name: "ベースA + トッピング2", price: 450, cost: 220 },
    { id: "p3", name: "ベースB + トッピング1", price: 420, cost: 210 },
    { id: "p4", name: "ベースB + トッピング2", price: 480, cost: 230 },
  ];

  return (
    <div className="product-grid">
      {products.map(p => (
        <button key={p.id} className="product-card" onClick={() => onAdd(p)}>
          <div className="product-name">{p.name}</div>
          <div className="product-price">¥{p.price}</div>
        </button>
      ))}
    </div>
  );
}
