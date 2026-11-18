import { usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { xsrfToken } from '@/echo';
import { heartbeat } from '@/routes/actors/presence';
import { presenceHeartbeat } from './presenceHeartbeat';

/**
 * How often an open viewer beats; config/actors.php heartbeat_seconds holds the same 30 seconds for the server.
 */
const HEARTBEAT_MILLISECONDS = 30_000;

/**
 * The shell's one heartbeat sender: it beats while a user is signed in, stops when the user signs out or the shell
 * leaves, and beats at once when the tab becomes visible again.
 */
export function usePresenceHeartbeat(): void {
    const page = usePage();
    const sender = presenceHeartbeat(sendHeartbeat, HEARTBEAT_MILLISECONDS);

    function follow(userId: string | undefined): void {
        sender.stop();

        if (userId !== undefined) {
            sender.start();
        }
    }

    function beatWhenVisible(): void {
        if (document.visibilityState === 'visible') {
            sender.beatNow();
        }
    }

    onMounted(() => {
        follow(page.props.currentUser?.id);
        watch(() => page.props.currentUser?.id, follow);
        document.addEventListener('visibilitychange', beatWhenVisible);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', beatWhenVisible);
        sender.stop();
    });
}

async function sendHeartbeat(): Promise<number> {
    const response = await fetch(heartbeat.url(), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
    });

    return response.status;
}
