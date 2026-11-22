import { describe, expect, it } from 'vitest';
import type { ChatEventData, ChatMessageData } from '@generated/types/chat';
import { chatTimeline } from './chatTimeline';

function row(sequence: number, readByMe = false): ChatMessageData {
    return {
        id: `m${sequence}`,
        sequence,
        rootId: null,
        speaker: { actor: 'user:bea', label: 'Bea', driver: null },
        addressedTo: null,
        replyTo: null,
        body: `Row ${sequence}`,
        state: 'sent',
        stateVersion: 1,
        respondent: null,
        actions: { answer: false, decline: false },
        readByMe,
        sentAt: '2026-11-22T10:00:00Z',
        requestKey: null,
    } as ChatMessageData;
}

function event(sequence: number): ChatEventData {
    return { sequence, type: 'message', actor: 'user:bea', messageId: `m${sequence}` };
}

const ids = (rows: ChatMessageData[]) => rows.map((shown) => shown.id);

describe('chatTimeline', () => {
    it('holds 12 that arrives before 11 and then shows 11 and 12 once', () => {
        const timeline = chatTimeline([row(9), row(10)], 10, null);

        timeline.offerPage([row(12)], 12, false);

        expect(ids(timeline.shown())).toEqual(['m9', 'm10']);
        expect(timeline.hasGap()).toBe(true);

        const missing = timeline.missingOf([event(11), event(12)]);
        expect(missing).toEqual(['m11']);

        timeline.offerRows([row(11), row(12)]);
        timeline.advance(12);

        expect(ids(timeline.shown())).toEqual(['m9', 'm10', 'm11', 'm12']);
        expect(timeline.hasGap()).toBe(false);
    });

    it('keeps a laptop at 10 receiving 11 and 12 after the phone read them', () => {
        const laptop = chatTimeline([row(10)], 10, null);

        laptop.offerRows([row(11, true), row(12, true)]);
        laptop.advance(12);

        expect(ids(laptop.shown())).toEqual(['m10', 'm11', 'm12']);
    });

    it('pages back past the snapshot with every older row once', () => {
        const timeline = chatTimeline([row(50), row(51), row(52)], 52, 'older-1');

        timeline.offerOlder([row(49), row(50), row(51)], 'older-2');
        timeline.offerOlder([row(48), row(49)], null);

        expect(ids(timeline.shown())).toEqual(['m48', 'm49', 'm50', 'm51', 'm52']);
        expect(timeline.olderCursor()).toBeNull();
    });

    it('starts again from a fresh snapshot after a refused cursor', () => {
        const timeline = chatTimeline([row(3)], 3, null);

        timeline.restart([row(20)], 25, 'older-1');

        expect(ids(timeline.shown())).toEqual(['m20']);
        expect(timeline.through()).toBe(25);
    });
});
