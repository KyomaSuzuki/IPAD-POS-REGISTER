"use client";
import React from "react";

export function Display({
  total,
  input,
  change,
}: {
  total: number;
  input: string;
  change: number | null;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-80 text-center">
      <p className="text-lg font-bold text-gray-700">合計: ¥{total}</p>
      <p className="text-lg text-gray-600">預かり金: ¥{input || "0"}</p>
      {change !== null && (
        <p className="text-2xl font-bold text-green-600 mt-2">お釣り: ¥{change}</p>
      )}
    </div>
  );
}
