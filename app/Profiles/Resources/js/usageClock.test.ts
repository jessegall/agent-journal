// @vitest-environment happy-dom
import type { AccountRowData } from '@generated/types/accounts';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { nextUsageChange, useUsageClock } from './usageClock';

const reload = vi.fn();

vi.mock('@inertiajs/vue3', () => ({
    router: { reload: (options: unknown) => reload(options) },
}));

function rowWithReset(resetsAt: string): AccountRowData {
    return {
        id: 'acc-1',
        usage: {
            windows: [
                {
                    limitId: 'claude',
                    slot: 'seven_day',
                    usedPercent: 42,
                    windowMinutes: null,
                    resetsAt,
                    observedAt: '2026-11-21T10:00:00Z',
                },
            ],
        },
    } as unknown as AccountRowData;
}

function clockOver(rows: AccountRowData[]) {
    let now: { value: Date } | undefined;
    mount(
        defineComponent({
            setup() {
                now = useUsageClock(() => rows);

                return () => h('div');
            },
        }),
    );

    return now!;
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-30T23:00:00Z'));
});

afterEach(() => {
    vi.useRealTimers();
    reload.mockClear();
});

describe('the usage clock', () => {
    it('waits for the nearest reset ahead or the next UTC month, whichever is first', () => {
        const now = new Date('2026-11-21T12:00:00Z');

        expect(nextUsageChange([rowWithReset('2026-11-22T00:00:00Z')], now)).toEqual(
            new Date('2026-11-22T00:00:00Z'),
        );
        expect(nextUsageChange([rowWithReset('2026-11-01T00:00:00Z')], now)).toEqual(
            new Date('2026-12-01T00:00:00Z'),
        );
    });

    it('moves on at a reset without a reload', () => {
        const now = clockOver([rowWithReset('2026-11-30T23:30:00Z')]);

        vi.advanceTimersByTime(30 * 60 * 1000);

        expect(now.value).toEqual(new Date('2026-11-30T23:30:00Z'));
        expect(reload).not.toHaveBeenCalled();
    });

    it('rereads only the page prop when a UTC month begins', () => {
        clockOver([]);

        vi.advanceTimersByTime(60 * 60 * 1000);

        expect(reload).toHaveBeenCalledTimes(1);
        expect(reload).toHaveBeenCalledWith({ only: ['page'] });
    });
});
