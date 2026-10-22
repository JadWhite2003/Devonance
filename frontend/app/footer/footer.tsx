import React from 'react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

const footerSocials = [
    { icon: FaGithub, href: "https://github.com/JadWhite2003", label: "Github" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/jadon-white-b27828202/", label: "Linkedin" },

]

const Footer = () => {
  return (
    <footer className='border-t dark:bg-gray-950 bg-zinc-900/50 border-gray-200 dark:border-gray-800 py-12'>
        {/* Scrolling divider */}
            <div className='relative overflow-hidden'>
                <div className='animate-scrollHorizontal flex flex-nowrap whitespace-nowrap gap-16'>
                    <span className='font-bold text-7xl text-white/20'> Devonance </span>
                    <span className='font-bold text-7xl text-white/20'> Thanks for Visiting! </span>
                    <span className='font-bold text-7xl text-white/20'>Devonance </span>
                    <span className='font-bold text-7xl text-white/20'> Thanks for Visiting! </span>

                    {/*seamless animation*/}
                    <span className='font-bold text-7xl text-white/20'>Devonance </span>
                    <span className='font-bold text-7xl text-white/20'> Thanks for Visiting! </span>
                    <span className='font-bold text-7xl text-white/20'>Devonance </span>
                    <span className='font-bold text-7xl text-white/20'> Thanks for Visiting! </span>

                </div>
            </div>
        <div className="w-[80%] mx-auto">
            <div className='flex flex-col md:flex-row items-center justify-center gap-6'>
      
                <div className="flex items-center gap-4">
                    {footerSocials.map((link) =>{
                        return <a href={link.href} key={link.label} target="_blank" rel="noopener noreferrer" className='w-10 h-10 rounded-lg shadow-md flex items-center justify-center text-muted-foreground hover:text-blue-500 transition-colors'>
                            <link.icon className='w-5 h-5' />
                        </a>

                    })}

                </div>
                <p className="text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} Devonance. All rights reserved.
                </p>

            </div>

        </div>
    </footer>
  )
}

export default Footer