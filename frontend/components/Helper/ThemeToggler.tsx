"use client";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useState, useEffect } from 'react'

const ThemeToggler = () => {
    const [mounted, setMounted] = useState(false);

    const { theme, setTheme, systemTheme } = useTheme();

    useEffect(() => {
        const mountCheck=() => {setMounted(true)};
      mountCheck();  
    }, 
    []);
    if (!mounted) return null;
    
    const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 transition cursor-pointer rounded-xl flex flex-col items-center justify-center shadow-xs shadow-zinc-500" onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}>
      {currentTheme === "dark" ? <Sun className="text-white w-6 h-6 cursor-pointer" /> : <Moon className="text-black w-6 h-6 cursor-pointer"/>}
    </button>
  )
}

export default ThemeToggler