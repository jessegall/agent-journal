// the address of the Files window opened at a dashboard's file row: its path, and its line when the row names one
export function fileAddress(href, node, page) {
    const address = new URL(href);
    address.searchParams.set("page", page);
    address.searchParams.set("file", node.path);
    if (node.line) address.searchParams.set("line", String(node.line));
    else address.searchParams.delete("line");
    return address.href;
}
