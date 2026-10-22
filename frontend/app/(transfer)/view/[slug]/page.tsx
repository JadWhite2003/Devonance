import {ReceivePage} from "@/components/receive-panel"

export default async function ViewPage({
    params,
}: {
    params: Promise <{ slug: string}>;

}) {
    const {slug} = await params;
    return <ReceivePage initialSlug={slug} /> 
}