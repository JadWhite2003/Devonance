const API_URL = process.env.NEXT_PUBLIC_API_URL ;

export type SendOptions = {
    custom_slug?: string;
    max_uses?: number; //blank when infinite uses
    expires_in?: number; //in seconds
};

async function handleResponse(res: Response) {
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        const detail = body?.detail;
        throw new Error(typeof detail === "string" ? detail : "Something went wrong")
    }
    return res.json();
}

export async function createPaste(content: string, options: SendOptions = {}) {
    const res = await fetch(`${API_URL}/paste`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content, ...options}),
    });
    return handleResponse(res) as Promise <{slug: string, url: string}>;
}

export async function uploadFiles (files: File[], options: SendOptions = {}) {
    const formData = new FormData();
    files.forEach((f) => formData.append("files",f));
    if (options.custom_slug) formData.append("custom_slug", options.custom_slug);
    if (options.max_uses) formData.append("max_uses", String(options.max_uses));
    if (options.expires_in) formData.append("expires_in", String(options.expires_in));

    const res = await fetch(`${API_URL}/upload`, {method: "POST", body: formData});
    return handleResponse(res) as Promise <{slug: string, url: string}>;
}