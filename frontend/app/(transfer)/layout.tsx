import {Card, CardContent} from "@/components/ui/card";
import {NavTabs} from "@/components/navtabs";

export default function TransferLayout({children}: {children: React.ReactNode}) {
    return (
        <Card className="w-full max-w-md overflow-hidden p-0 shadow-sm shadow-zinc-500 transition-all">
            <NavTabs />
            <CardContent className="space-y-4 p-6">{children} </CardContent>
        </Card>
    )
};