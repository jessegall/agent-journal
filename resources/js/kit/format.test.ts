import { describe, expect, it } from 'vitest';
import { count, counted, dateOnly, dateTime, dollars, elapsed, seconds, size, timeAgo, timeOfDay } from './format';

describe('format', () => {
    const now = Date.parse('2026-11-21T12:00:00Z');

    it('says how long ago a moment was in its largest unit, and how far ahead', () => {
        expect(timeAgo(now - 10_000, now)).toBe('just now');
        expect(timeAgo(now - 4 * 60_000, now)).toBe('4m ago');
        expect(timeAgo(now - 3 * 3_600_000, now)).toBe('3h ago');
        expect(timeAgo(now - 2 * 86_400_000, now)).toBe('2d ago');
        expect(timeAgo(now + 4 * 60_000, now)).toBe('in 4m');
        expect(timeAgo('2026-11-21T11:56:00Z', now)).toBe('4m ago');
    });

    it('writes a moment in the viewer zone, never the server string', () => {
        const at = '2026-11-03T12:19:00Z';

        for (const written of [dateTime(at), dateOnly(at), timeOfDay(at)]) {
            expect(written).not.toContain('T12:19');
            expect(written).not.toContain('Z');
        }
        expect(dateOnly(at)).toContain('2026');
    });

    it('writes how long something ran in its two largest units', () => {
        expect(elapsed(40_000)).toBe('40s');
        expect(elapsed(65_000)).toBe('1m 5s');
        expect(elapsed(2 * 3_600_000 + 3 * 60_000 + 9_000)).toBe('2h 3m');
        expect(elapsed(-5)).toBe('0s');
        expect(seconds(2.44)).toBe('2.4 s');
    });

    it('groups counts and names them one or many', () => {
        expect(count(12_345)).toBe('12,345');
        expect(counted(1, 'task', 'tasks')).toBe('1 task');
        expect(counted(3, 'task', 'tasks')).toBe('3 tasks');
    });

    it('writes dollars with less than a cent and a real zero', () => {
        expect(dollars(0)).toBe('$0.00');
        expect(dollars(0.004)).toBe('< $0.01');
        expect(dollars(12.5)).toBe('$12.50');
    });

    it('writes byte sizes in decimal units', () => {
        expect(size(512)).toBe('512 B');
        expect(size(1_400)).toBe('1.4 kB');
        expect(size(9_000_000)).toBe('9.0 MB');
        expect(size(2_500_000_000)).toBe('2.5 GB');
    });
});
