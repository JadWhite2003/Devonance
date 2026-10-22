'use client'
import Link from "next/link";
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import ThemeToggler from "@/components/Helper/ThemeToggler"
import { FaGithub } from "react-icons/fa6";
import { MenuIcon } from "lucide-react";

type Props = {
    onOpen: () => void
}

const SiteNav = ({ onOpen }: Props) => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    return (
        <header className="m-4 flex items-center justify-between rounded-lg border px-4 py-3 text-sm backdrop-blur-md bg-transparent transition-all font-bold">
            <nav className="items-center gap-3 bg-transparent transition-all hidden md:flex">
                <a href="https://jadportfolio-34yy.vercel.app/" target="_blank" rel="noreferrer">
                    My Portfolio
                </a>
                <Separator orientation="vertical" className="text-muted-foreground" />
                <a href="https://chromewebstore.google.com" target="_blank" rel="noreferrer">
                    Try the Chrome Extension
                </a>
                <Separator orientation="vertical" className="text-muted-foreground" />
                <a href="https://github.com/JadWhite2003/Devonance" target="_blank" rel="noreferrer">
                    Report Issue
                </a>
                <Separator orientation="vertical" className="text-muted-foreground" />
                <a href="https://github.com/JadWhite2003/Devonance" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-1">
                    <FaGithub className="w-4 h-4" />
                    GitHub
                </a>
                {/* Mobile nav */}

            </nav>
            <button aria-label="Open menu" onClick={onOpen}>
                <MenuIcon className='w-6 h-6 cursor-pointer text-black dark:text-white lg:hidden' />
            </button>
            <span className="text-bold text-2xl md:hidden flex"> Devonance</span>
            <ThemeToggler />
        </header>
    )
}

export default SiteNav