'use client';

import { useRef, useState } from "react";
import { UploadCloud, X, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MAX_FILE_SIZE = 50 * 1024 * 1024

export function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"]
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** i;
    return `${value.toFixed(i === 0 ? 0 : 1)} ${units[1]}`
};

const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

type Props = {
    files: File[];
    onChange: (files: File[]) => void;
    maxSize?: number;
}

export function FileDropzone({ files, onChange, maxSize = MAX_FILE_SIZE }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null)

    function addFiles(incoming: File[]) {
        const seen = new Set(files.map(fileKey));
        const accepted: File[] = [];
        const tooBig: string[] = [];

        for (const f of incoming) {
            if (f.size > maxSize) {
                tooBig.push(f.name);
            } else if (!seen.has(fileKey(f))) {
                seen.add(fileKey(f));
                accepted.push(f);
            }
        }
        setError(
            tooBig.length
                ? `Too large (max ${formatBytes(maxSize)}): ${tooBig.join(", ")}`
                : null
        );
        if (accepted.length) onChange([...files, ...accepted]);
    }

    function removeFile(target: File) {
        onChange(files.filter((f) => fileKey(f) !== fileKey((target))));
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false)
        addFiles(Array.from(e.dataTransfer.files))
    }

    function handleDragLeave(e: React.DragEvent) {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setIsDragging(false)
        }
    }

    return (
        <div className="space-y-3">
            <div role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();

                }
            }}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
                    isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-muted-foreground/60"
                )}
            >
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm">
                    <span className="font-medium"> Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                    Max {formatBytes(maxSize)} per file
                </p>
                <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => addFiles(Array.from(e.target.files ?? []))} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {files.length > 0 && (
                <ul className="space-y-2">
                    {files.map((f) => (
                        <li key={fileKey(f)}
                            className="flex items-center gap-3 rounded-md border p-2 pl-3">
                            <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="flex-1 truncate text-sm">{f.name}</span>
                            <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(f.size)}</span>
                            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label={`Remove ${f.name}`} onClick={() => removeFile(f)}> <X className="h-4 w-4" /> </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div >
    )
}