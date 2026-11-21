import type { AccountRowData } from '@generated/types/accounts';
import { router } from '@inertiajs/vue3';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * The longest a browser timer waits; a later change is waited for again from there.
 */
const longestTimer = 2_147_483_647;

/**
 * The next moment the usage the rows show changes by itself: the nearest reset still ahead among their windows, or
 * the start of the next UTC month, whichever comes first.
 */
export function nextUsageChange(rows: AccountRowData[], now: Date): Date {
    const nextMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
    );
    const resets = rows
        .flatMap((row) => row.usage?.windows ?? [])
        .flatMap((window) => (window.resetsAt === null ? [] : [new Date(window.resetsAt)]))
        .filter((reset) => reset > now);

    return resets.reduce(
        (nearest, reset) => (reset < nearest ? reset : nearest),
        nextMonth,
    );
}

function monthOf(moment: Date): number {
    return moment.getUTCFullYear() * 12 + moment.getUTCMonth();
}

/**
 * The time the Accounts page chooses its usage lines by: moved on at the next usage change and when the window gets
 * focus again. Crossing into a new UTC month rereads only the page prop, so the server sums the new month; a reload
 * keeps the page's state, so an open dialog stays.
 */
export function useUsageClock(rows: () => AccountRowData[]): Ref<Date> {
    const now = ref(new Date());
    let timer: ReturnType<typeof setTimeout> | undefined;

    function moveOn(): void {
        const before = now.value;
        now.value = new Date();

        if (monthOf(now.value) !== monthOf(before)) {
            router.reload({ only: ['page'] });
        }

        schedule();
    }

    function schedule(): void {
        clearTimeout(timer);
        const wait = nextUsageChange(rows(), now.value).getTime() - now.value.getTime();
        timer = setTimeout(moveOn, Math.min(Math.max(wait, 0), longestTimer));
    }

    watch(rows, schedule);
    onMounted(() => {
        window.addEventListener('focus', moveOn);
        schedule();
    });
    onUnmounted(() => {
        clearTimeout(timer);
        window.removeEventListener('focus', moveOn);
    });

    return now;
}
