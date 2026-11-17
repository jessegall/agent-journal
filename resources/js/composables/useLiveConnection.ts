import { usePage } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, watch } from 'vue';
import type { PersonConnection } from '@/echo';
import { connectPerson } from '@/echo';
import { forgetPageChanges, pageChanged } from './usePageChanges';

/**
 * The shell's one connection: opened in the browser for the signed-in viewer, opened again only for a new viewer, and
 * closed when the viewer signs out or the shell leaves.
 */
export function useLiveConnection(): void {
    const page = usePage();
    let connection: PersonConnection | undefined;

    function follow(viewerId: string | undefined): void {
        if (connection?.personId === viewerId) {
            return;
        }

        connection?.leave();
        connection = undefined;
        forgetPageChanges();

        if (viewerId !== undefined) {
            connection = connectPerson(viewerId, pageChanged, pageChanged);
        }
    }

    onMounted(() => {
        follow(page.props.viewer?.id);
        watch(() => page.props.viewer?.id, follow);
    });
    onBeforeUnmount(() => follow(undefined));
}
