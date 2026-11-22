import { describe, expect, it } from 'vitest';
import { SharedPropReads } from './sharedPropReads';
import type { PropReadOutcome } from './sharedPropReads';

function readsWithSender() {
    const sent: { propName: string; ended: (outcome: PropReadOutcome) => void; cancelled: boolean }[] = [];
    const reads = new SharedPropReads((propName, ended) => {
        const read = { propName, ended, cancelled: false };
        sent.push(read);

        return () => (read.cancelled = true);
    });

    return { reads, sent };
}

describe('shared prop reads', () => {
    it('sends one read for two mounts of the same key and only the asking mount announces', () => {
        const { reads, sent } = readsWithSender();
        const heard: string[] = [];
        const key = reads.keyOf('user-1', 'window_plans', '');

        reads.request(key, 'window_plans', 1, (outcome) => heard.push(`1:${outcome}`));
        reads.request(key, 'window_plans', 2, (outcome) => heard.push(`2:${outcome}`));
        sent[0].ended('applied');

        expect(sent).toHaveLength(1);
        expect(heard).toEqual(['1:applied']);
    });

    it('hands the announcement to a surviving mount when the asking one leaves', () => {
        const { reads, sent } = readsWithSender();
        const heard: string[] = [];
        const key = reads.keyOf('user-1', 'window_plans', '');
        reads.request(key, 'window_plans', 1, (outcome) => heard.push(`1:${outcome}`));
        reads.request(key, 'window_plans', 2, (outcome) => heard.push(`2:${outcome}`));

        reads.detach(key, 1);
        sent[0].ended('failed');

        expect(sent[0].cancelled).toBe(false);
        expect(heard).toEqual(['2:failed']);
    });

    it('cancels the read when its last mount leaves', () => {
        const { reads, sent } = readsWithSender();
        const key = reads.keyOf('user-1', 'window_plans', '');
        reads.request(key, 'window_plans', 1, () => undefined);

        reads.detach(key, 1);

        expect(sent[0].cancelled).toBe(true);
    });

    it('discards a success that arrives after a denial, in every mount', () => {
        const { reads, sent } = readsWithSender();
        const heard: string[] = [];
        const plans = reads.keyOf('user-1', 'window_plans', '');
        const tasks = reads.keyOf('user-1', 'window_tasks', '');
        reads.request(plans, 'window_plans', 1, (outcome) => heard.push(`plans:${outcome}`));
        reads.request(tasks, 'window_tasks', 2, (outcome) => heard.push(`tasks:${outcome}`));

        sent[1].ended('denied');
        sent[0].ended('applied');

        expect(heard).toEqual(['tasks:denied']);
        expect(sent[0].cancelled).toBe(true);
        expect(reads.keyOf('user-1', 'window_plans', '')).not.toBe(plans);
    });

    it('never shares a read between two keys', () => {
        const { reads, sent } = readsWithSender();

        reads.request(reads.keyOf('user-1', 'window_plans', '?a'), 'window_plans', 1, () => undefined);
        reads.request(reads.keyOf('user-1', 'window_plans', '?b'), 'window_plans', 2, () => undefined);

        expect(sent).toHaveLength(2);
    });
});
