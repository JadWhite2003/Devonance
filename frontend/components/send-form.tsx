"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "./ui/separator";
import { createPaste, uploadFiles, type SendOptions } from "@/lib/api";

type UseLimit = "once" | "infinite" | "custom";

export default function SendForm() {
    const [mode, setMode] = useState<"text" | "files">("text");
    const [text, setText] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [customSlug, setCustomSlug] = useState("");
    const [useLimit, setUseLimit] = useState<UseLimit>("once");
    const [customLimit, setCustomLimit] = useState(2);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    function buildOptions(): SendOptions {
        return {
            max_uses: useLimit === "once" ? 1 : useLimit === "custom" ? customLimit : undefined,
            custom_slug: customSlug.trim() || undefined,
        }
    }
    async function handleSend() {
        setError(null);
        setShareUrl(null);
        setLoading(true);
        try {
            const options = buildOptions();
            const { slug } = mode === "text" ? await createPaste(text, options) : await uploadFiles(files, options);
            setShareUrl(`${window.location.origin}/view/${slug}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong");

        } finally {
            setLoading(false);
        }
    }
    const canSend = mode === "text" ? text.trim().length > 0 : files.length > 0;

    async function handleShare() {
        if (!shareUrl) return;
        if (navigator.share) {
            await navigator.share({ title: "Here's something for you", url: shareUrl })
        } else {
            await navigator.clipboard.writeText(shareUrl);
        }
    }
    return (
        <div className="">
            <p className="text-sm text-muted-foreground text-center">Transfer your files/text</p>

            <Tabs value={mode} onValueChange={(v) => setMode(v as "text" | "files")}>
                <TabsList className="text-center flex items-center justify-center w-full m-1">
                    <TabsTrigger value="text">Text</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>
                <Separator />
                <div className="space-y-2 py-4">
                    <Label className=" font-bold">Select use limit:</Label>
                    <RadioGroup value={useLimit} onValueChange={(v) => setUseLimit(v as UseLimit)} className="flex items-center gap-4 w-full justify-center text-center">
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="once" id="once" />
                            <Label htmlFor="once">Once</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="infinite" id="infinite" />
                            <Label htmlFor="infinite">Infinite</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <Label htmlFor="custom">Custom</Label>
                            <Input type="number" min={1} className="w-20" value={customLimit} onChange={(e) => setCustomLimit(Math.max(1, Number(e.target.value)))} />
                        </div>

                    </RadioGroup>
                </div>
                <TabsContent value="text" className="p-3">
                    <Textarea placeholder="Enter your text here..." className="min-h-[200px]" value={text} onChange={(e) => setText(e.target.value)} />
                </TabsContent>
                <TabsContent value="files" className="">
                    <Input type="file" className="border-b-gray-100 m-3" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                    <ul className="mt-2 text-sm text-muted-foreground">{files.map((f) => (<li key={f.name}>{f.name}</li>))}</ul>
                </TabsContent>
            </Tabs>
            <Input placeholder="Custom URL - Leave blank for auto-generated" className="m-3 items-center" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {shareUrl && (
                <div className="flex gap-2">
                    <Input readOnly value={shareUrl} />
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy</Button>
                </div>
            )}
            <Separator className="m-1"/>
            <div className="flex justify-between p-2">
                <Button variant="outline" onClick={handleShare} disabled={!shareUrl}>Share</Button>
                <Button onClick={handleSend} disabled={!canSend || loading} >{loading ? "Sending..." : "Send"}</Button>

            </div>
        </div>
    )
}
