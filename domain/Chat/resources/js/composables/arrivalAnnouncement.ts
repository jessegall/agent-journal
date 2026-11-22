import type { ChatMessageData } from '@generated/types/chat';

/**
 * What the polite region says about new posts by others: each once, by speaker and addressee. The rows a view first
 * shows are only remembered, and a row shown again, as a reload or a replayed event brings it, stays quiet.
 */
export function arrivalAnnouncement(viewer: () => string, labelOf: (actor: string) => string) {
    const heard = new Set<string>();
    let isStarted = false;

    return (rows: ChatMessageData[]): string | null => {
        const fresh = rows.filter((row) => !heard.has(row.id));
        fresh.forEach((row) => heard.add(row.id));

        if (!isStarted) {
            isStarted = true;

            return null;
        }

        const incoming = fresh.filter((row) => row.speaker.actor !== viewer());

        if (incoming.length === 0) {
            return null;
        }

        return incoming
            .map((row) => {
                const addressee = row.addressedTo === null ? '' : ` to ${labelOf(row.addressedTo)}`;

                return `New message from ${row.speaker.label}${addressee}.`;
            })
            .join(' ');
    };
}
