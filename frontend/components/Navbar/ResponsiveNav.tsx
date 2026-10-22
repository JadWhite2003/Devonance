'use client';
import React, { useState } from 'react'
import SiteNav from './sitenav'
import MobileNav from './MobileNav'

const ResponsiveNav = () => {
    const [open, setOpen] = useState(false)
  return (
    <div>
        <SiteNav onOpen={() => setOpen(true)} />
        {open && <MobileNav onClose={() => setOpen(false)} />}
    </div>
  )
}

export default ResponsiveNav