import type { FlashData } from '@inertiajs/core';
import type { ToastOutcome } from '@/composables/toastStore';

/**
 * The success toast for the notice a page action flashed with its answer, shown on the page it came back to; none
 * when the answer flashed no notice.
 */
export function flashedNoticeToast(flash: FlashData, url: string): ToastOutcome[] {
    if (typeof flash.notice !== 'string') {
        return [];
    }

    return [{ key: crypto.randomUUID(), type: 'success', title: flash.notice, href: url }];
}
