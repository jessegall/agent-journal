import { describe, expect, it } from 'vitest';
import type {
    AccountUsageData,
    AccountUsageWindowData,
} from '@generated/types/accounts';
import { currentReadings, usageLine, windowFacts } from './accountUsage';

function window(
    fields: Partial<AccountUsageWindowData>,
): AccountUsageWindowData {
    return {
        limitId: 'limit-1',
        slot: 'seven_day',
        usedPercent: 42,
        windowMinutes: 10080,
        resetsAt: '2026-12-03T00:00:00Z',
        observedAt: '2026-11-30T20:00:00Z',
        ...fields,
    };
}

const thread = {
    total: 1200,
    input: null,
    cachedInput: null,
    output: null,
    reasoningOutput: null,
    lastTurnTotal: null,
    observedAt: '2026-11-30T20:00:00Z',
};

describe('account usage', () => {
    it('drops last month at the UTC rollover, and ranks a current month first', () => {
        const usage: AccountUsageData = {
            windows: [window({})],
            monthCost: {
                usd: '0.004',
                observations: 2,
                monthStart: '2026-11-01T00:00:00Z',
                lastObservedAt: '2026-11-30T23:00:00Z',
            },
        };

        expect(usageLine(usage, new Date('2026-11-30T23:59:00Z'))).toBe(
            'Est. < $0.01 this month',
        );
        const december = new Date('2026-12-01T00:00:30Z');
        expect(currentReadings(usage, december).monthCost).toBeUndefined();
        expect(usageLine(usage, december)).toMatch(/^Week 42% used, resets /);
    });

    it('takes a window past its reset as history, keeps a measured zero, and falls back to the latest thread', () => {
        const usage: AccountUsageData = {
            windows: [window({ usedPercent: 0 })],
            latestThread: thread,
        };

        expect(usageLine(usage, new Date('2026-12-02T00:00:00Z'))).toMatch(
            /^Week 0% used/,
        );
        expect(usageLine(usage, new Date('2026-12-04T00:00:00Z'))).toBe(
            'Latest thread: 1,200 tokens',
        );
        expect(
            windowFacts(usage, new Date('2026-12-04T00:00:00Z'))[0].value,
        ).toContain('0% used before it reset');
    });

    it('shows a reset-only reading with its date and no share, and gives it no row line', () => {
        const usage: AccountUsageData = {
            windows: [window({ usedPercent: null })],
        };
        const now = new Date('2026-12-01T00:00:00Z');

        expect(usageLine(usage, now)).toBeNull();
        const [fact] = windowFacts(usage, now);
        expect(fact.value).toMatch(/^resets .*, observed /);
        expect(fact.value).not.toContain('%');
    });

    it('says Last observed for a window with no reset', () => {
        const usage: AccountUsageData = {
            windows: [window({ resetsAt: null })],
        };

        expect(usageLine(usage, new Date('2026-12-01T00:00:00Z'))).toBe(
            'Last observed: Week 42% used',
        );
    });
});
