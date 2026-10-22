"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { File as FileIcon, Copy, Download, Ghost } from "lucide-react";
import { extractSlug } from "@/lib/parseSlug";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LinkInfo = | { type: "paste" } | { type: "file"; files: string[] };

export function ReceivePage({ initialSlug }: { initialSlug?: string }) {
    const [urlInput, setUrlInput] = useState("");
    const [slug, setSlug] = useState<string | null>(null);
    const [info, setInfo] = useState<LinkInfo | null>(null);
    const [content, setContent] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function lookup(extracted: string) {
        setError(null);
        setInfo(null);
        setContent(null)

        const res = await fetch(`${API_URL}/links/${extracted}/info`);
        if (!res.ok) {
            setError("Link not found or expired");
            return;
        }
        setSlug(extracted);
        setInfo(await res.json());

    }

    function handleSubmit() {
        lookup(extractSlug(urlInput))
    }

    useEffect(() => {
        if (initialSlug) lookup(initialSlug);
    }, [initialSlug])



    async function revealText() {
        const res = await fetch(`${API_URL}/paste/${slug}`);
        if (!res.ok) {
            setError("This link has expired or has already been used")
            return;
        }
        const data = await res.json();
        setContent(data.content);
    }
    function downloadAll() {
        window.location.href = `${API_URL}/download/${slug}`;
    }

    return (
        <div className="m-1">
            <p className="text-sm text-muted-foreground m-3 mt-1 text-center flex justify-center items-center">Receive your files/text</p>
            <Separator />
            <div className="flex justify-center items-center text-center">
                <Input placeholder="Input your URL" className="m-3" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
                <Button className="m-2 p-3" onClick={handleSubmit}>Submit</Button>
            </div>
            <Separator />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {info?.type === "paste" && !content && (
                <Button variant="outline" onClick={revealText} className="cursor-pointer">
                    Reveal text
                </Button>
            )}

            <div className="relative mt-4 h-52 w-full shrink-0 overflow-auto rounded-md  bg-card p-4 shadow-sm/20 shadow-zinc-100">
                {content && (
                    <>
                        <pre className="whitespace-pre-wrap break-words text-sm">{content}</pre>
                        <Separator />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1"
                            onClick={() => navigator.clipboard.writeText(content)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </>
                )}

                {info?.type === "file" && (
                    <div className="space-y-2">
                        {info.files.map((name) => (
                            <div key={name} className="rounded-md border p-2">
                                <span className="break-all text-sm">{name}</span>
                            </div>
                        ))}
                        <Button onClick={downloadAll}>
                            <Download className="h-4 w-4" />
                            Download all
                        </Button>
                    </div>
                )}

                {!content && info?.type !== "file" && (
                    <p className="text-sm text-muted-foreground text-center">Content will appear here:</p>
                )}
            </div>
        </div>
    )


}