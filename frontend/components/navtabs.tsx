"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {cn} from "@/lib/utils";

const tabs = [
    {href: "/send", label: "Send", match: (p: string) => p.startsWith("/send")},
    {href: "/receive", label: "Receive", match: (p: string) => p.startsWith("/receive")},
];

export function NavTabs() {
    const pathname = usePathname();
    return (
        <div className="flex border-b">
            {tabs.map((t) => (
                <Link key={t.href} href={t.href} className={cn("flex-1 p-3 text-center text-sm transition-colors", t.match(pathname) ? "border-b-2 border-primary font-medium": "text-muted-foreground hover:text-foreground")}> 
                {t.label}
                </Link>
            ))}
        </div>
    )
}