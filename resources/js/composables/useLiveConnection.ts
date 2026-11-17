import { usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import type { UserConnection } from '@/echo';
import { connectUser } from '@/echo';
import { forgetPageChanges, pageChanged } from './usePageChanges';

/**
 * The shell's one connection: opened in the browser for the signed-in user, opened again only for a new user, and
 * closed when the user signs out or the shell leaves.
 */
export function useLiveConnection(): void {
    const page = usePage();
    let connection: UserConnection | undefined;

    function follow(userId: string | undefined): void {
        if (connection?.userId === userId) {
            return;
        }

        connection?.leave();
        connection = undefined;
        forgetPageChanges();

        if (userId !== undefined) {
            connection = connectUser(userId, pageChanged, pageChanged);
        }
    }

    onMounted(() => {
        follow(page.props.currentUser?.id);
        watch(() => page.props.currentUser?.id, follow);
    });
    onBeforeUnmount(() => follow(undefined));
}
