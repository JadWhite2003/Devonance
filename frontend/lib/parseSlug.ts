export function extractSlug(input: string): string {
    const trimmed = input.trim();
    try {
        const url = new URL(trimmed);
        const parts = url.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1];
    } catch {
        return trimmed;
    }
}