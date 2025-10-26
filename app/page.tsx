// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import Keypad from "./components/Keypad";
import Link from "next/link";

type Item = { id: string; name: string; price: number; cost: number; quantity: number; };
type Sale = {
  date: string; // ISO
  items: { id: string; name: string; price: number; cost: number; quantity: number }[];
  total: number;
  payment: number;
  change: number;
};

const LOCAL_KEY = "pos_sales_v1";
const FIXED_COST_PER_DAY = 500; // 必要なら変更

export default function Page() {
  const [cart, setCart] = useState<Item[]>([]);
  const [depositInput, setDepositInput] = useState<string>("");
  const [change, setChange] = useState<number | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);

  // 初期商品は ProductList コンポーネントでも保持しますがここにも定義（ProductList から onAdd を受け取る）
  const addToCart = (base: { id: string; name: string; price: number; cost: number }) => {
    setCart(prev => {
      // 同じ商品があれば quantity++
      const idx = prev.findIndex(p => p.id === base.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      } else {
        return [...prev, { ...base, quantity: 1 }];
      }
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart(prev => {
      const copy = prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p);
      return copy;
    });
  };

  const removeItem = (id: string) => setCart(prev => prev.filter(p => p.id !== id));

  const total = cart.reduce((s, p) => s + p.price * p.quantity, 0);
  const totalCost = cart.reduce((s, p) => s + p.cost * p.quantity, 0);

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) setSales(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(sales));
  }, [sales]);

  const confirmSale = () => {
    const payment = parseInt(depositInput || "0", 10);
    if (isNaN(payment)) return;
    if (payment < total) {
      alert("支払いが不足しています");
      return;
    }
    const ch = payment - total;
    const sale: Sale = {
      date: new Date().toISOString(),
      items: cart.map(({ id, name, price, cost, quantity }) => ({ id, name, price, cost, quantity })),
      total,
      payment,
      change: ch,
    };
    setSales(prev => [...prev, sale]);
    setCart([]);
    setDepositInput("");
    setChange(ch);
    // small visual confirmation (keeps change displayed)
  };

  const resetAll = () => {
    setCart([]);
    setDepositInput("");
    setChange(null);
  };

  return (
    <main className="page-root">
      <header className="header">
        <h1 className="title">iPad POS</h1>
        <nav>
          <Link className="nav-btn" href="/summary">日別集計</Link>
        </nav>
      </header>

      <section className="content">
        <div className="left">
          <ProductList onAdd={addToCart} />
        </div>

        <div className="right">
          <div className="cart-card">
            <h2>カート</h2>
            {cart.length === 0 ? <p className="muted">商品を選んでください</p> : (
              <ul className="cart-list">
                {cart.map(item => (
                  <li key={item.id} className="cart-item">
                    <div className="cart-item-left">
                      <div className="cart-name">{item.name}</div>
                      <div className="cart-sub">¥{item.price} × {item.quantity}</div>
                    </div>
                    <div className="cart-item-right">
                      <div className="cart-price">¥{item.price * item.quantity}</div>
                      <div className="qty-controls">
                        <button onClick={() => changeQty(item.id, -1)} className="small-btn">−</button>
                        <button onClick={() => changeQty(item.id, +1)} className="small-btn">＋</button>
                        <button onClick={() => removeItem(item.id)} className="small-btn danger">削除</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="summary-row">
              <div>合計</div>
              <div className="big">¥{total}</div>
            </div>
            <div className="summary-row">
              <div>原価合計</div>
              <div>¥{totalCost}</div>
            </div>

            <div className="deposit-area">
              <label className="label">預かり金</label>
              <div className="deposit-display">¥{depositInput || "0"}</div>
            </div>

            <div className="keypad-wrap">
              <Keypad
                onPress={(key) => {
                  if (key === "C") setDepositInput("");
                  else if (key === "OK") confirmSale();
                  else setDepositInput(prev => prev + key);
                }}
              />
            </div>

            <div className="actions">
              <button className="primary" onClick={confirmSale}>会計</button>
              <button className="secondary" onClick={resetAll}>リセット</button>
            </div>

            {change !== null && (
              <div className="change-box">お釣り：<span className="change-amount">¥{change}</span></div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
