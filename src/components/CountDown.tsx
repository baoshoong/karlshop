"use client"
import React, { useState, useEffect } from "react";

const CountDown = () => {
  const [delay, setDelay] = useState<number | null>(null);

  useEffect(() => {
    const targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 tiếng nữa

    const updateTime = () => {
      const diff = +targetDate - +new Date();
      setDelay(diff > 0 ? diff : 0);
    };

    updateTime(); // chạy lần đầu
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  if (delay === null) return null; // tránh lỗi hydration

  const d = Math.floor(delay / (1000 * 60 * 60 * 24));
  const h = Math.floor((delay / (1000 * 60 * 60)) % 24);
  const m = Math.floor((delay / 1000 / 60) % 60);
  const s = Math.floor((delay / 1000) % 60);

  return (
    <span className="font-bold text-5xl text-yellow-300">
      {d}:{h}:{m}:{s}
    </span>
  );
};

export default CountDown;
