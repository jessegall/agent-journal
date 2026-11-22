import { describe, expect, it } from 'vitest';
import { flashedNoticeToast } from './flashedNotice';

describe('flashedNoticeToast', () => {
    it('makes one success toast of a flashed notice on the page it came back to, and none without one', () => {
        const [toast] = flashedNoticeToast({ notice: 'Settings saved' }, '/settings');

        expect(toast).toMatchObject({ type: 'success', title: 'Settings saved', href: '/settings' });
        expect(flashedNoticeToast({ stopRequestId: 'r-1' }, '/settings')).toEqual([]);
    });
});
