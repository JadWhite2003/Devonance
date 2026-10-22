'use client';
import { X } from 'lucide-react';
import Link from 'next/dist/client/link'
import React from 'react'
import { Separator } from '../ui/separator';
import { FaGithub } from 'react-icons/fa6';

type Props = {
  onClose: () => void
}

const MobileNav = ({ onClose }: Props) => {
  return (
    <div className='fixed inset-0 z-50 w-full h-full bg-black/50 backdrop-blur-md flex justify-center items-center'>
      {/* Mobile nav blurred overlay*/}
      <div className='flex flex-col gap-6 w-72 p-6 bg-black-900/40 backdrop-blur-md border border-white/10 rounded-2xl'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-bold text-white'>Navigation</h2>
          <button aria-label="Close menu" className='text-white text-lg cursor-pointer' onClick={onClose}>
            <X className='w-6 h-6' />
          </button>
        </div>
        {/* Mobile nav links */}
        <nav className='flex flex-col'>
          <nav className="flex flex-col items-center gap-3 bg-transparent transition-all">
            <span> Download the PWA!</span>

            <a href="https://jadportfolio-34yy.vercel.app/" target="_blank" rel="noreferrer">
              My Portfolio
            </a>
            <Separator className="text-muted-foreground" />
            <a href="https://chromewebstore.google.com" target="_blank" rel="noreferrer">
              Try the Chrome Extension
            </a>
            <Separator className="text-muted-foreground" />
            <a href="https://github.com/JadWhite2003/Devonance" target="_blank" rel="noreferrer">
              Report Issue
            </a>
            <Separator className="text-muted-foreground" />
            <a href="https://github.com/JadWhite2003/Devonance" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-1">
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
          </nav>
        </nav>

      </div>

    </div>
  )
}

export default MobileNav