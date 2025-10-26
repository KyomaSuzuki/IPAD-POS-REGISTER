// app/summary/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Sale = {
  date: string;
  items: { id: string; name: string; price: number; cost: number; quantity: number }[];
  total: number;
  payment: number;
  change: number;
};

const LOCAL_KEY = "pos_sales_v1";
const FIXED_COST_PER_DAY = 500;

export default function SummaryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filter, setFilter] = useState<"today" | "yesterday" | "all">("today");
  const [grouped, setGrouped] = useState<{ day: string; sales: Sale[] }[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    const arr: Sale[] = raw ? JSON.parse(raw) : [];
    setSales(arr);

    // group by day (yyyy-mm-dd)
    const groupedMap: { [k: string]: Sale[] } = {};
    arr.forEach(s => {
      const d = new Date(s.date).toISOString().slice(0, 10);
      groupedMap[d] = groupedMap[d] || [];
      groupedMap[d].push(s);
    });
    const groupedArr = Object.entries(groupedMap)
      .map(([day, sls]) => ({ day, sales: sls }))
      .sort((a, b) => b.day.localeCompare(a.day));
    setGrouped(groupedArr);
  }, []);

  const getFiltered = () => {
    const today = new Date();
    const tStr = today.toISOString().slice(0, 10);
    const y = new Date();
    y.setDate(today.getDate() - 1);
    const yStr = y.toISOString().slice(0, 10);

    if (filter === "all") return grouped;
    return grouped.filter(g => (filter === "today" ? g.day === tStr : g.day === yStr));
  };

  const calcTotals = (salesList: Sale[]) => {
    const revenue = salesList.reduce((s, x) => s + x.total, 0);
    const cost = salesList.reduce((s, x) => s + x.items.reduce((a, b) => a + b.cost * b.quantity, 0), 0);
    const profit = revenue - cost - FIXED_COST_PER_DAY;
    return { revenue, cost, profit };
  };

  return (
    <main className="page-root">
      <header className="header">
        <h1 className="title">日別集計</h1>
        <nav>
          <Link className="nav-btn" href="/">レジに戻る</Link>
        </nav>
      </header>

      <section className="content center">
        <div className="controls">
          <button onClick={() => setFilter("today")} className={filter === "today" ? "tab active" : "tab"}>今日</button>
          <button onClick={() => setFilter("yesterday")} className={filter === "yesterday" ? "tab active" : "tab"}>昨日</button>
          <button onClick={() => setFilter("all")} className={filter === "all" ? "tab active" : "tab"}>全期間</button>
        </div>

        <div className="summary-card">
          {getFiltered().length === 0 ? (
            <p className="muted">該当するデータがありません</p>
          ) : (
            getFiltered().map(g => {
              const totals = calcTotals(g.sales);
              return (
                <div key={g.day} className="day-block">
                  <div className="day-row">
                    <div className="day-label">{g.day}</div>
                    <div>売上: ¥{totals.revenue}</div>
                    <div>利益: ¥{totals.profit}</div>
                  </div>
                  <div className="history">
                    {g.sales.map((s, idx) => (
                      <div key={idx} className="history-row">
                        <div className="time">{new Date(s.date).toLocaleTimeString()}</div>
                        <div className="desc">合計 ¥{s.total} / 受取 ¥{s.payment} / 釣銭 ¥{s.change}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
