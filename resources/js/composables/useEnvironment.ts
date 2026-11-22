import { usePage } from '@inertiajs/vue3';
import { computed, onMounted, ref } from 'vue';
import { keepStored, readStored } from '@/composables/browserStorage';

const STORAGE_KEY = 'environment';

export type EnvironmentChoice = { key: string; label: string };

// Held outside the function, so the shell keeps the choice while the page inside it changes.
const chosenKey = ref<string | null>(null);

/**
 * The environments the viewer may work in, as the page supplies them, and the one chosen: the first until another is
 * chosen, then the choice kept in the browser. The choice is the shell's, not a page's, so it stays across visits.
 */
export function useEnvironment() {
    const page = usePage<{ environments?: EnvironmentChoice[] }>();
    const environments = computed(() => page.props.environments ?? []);
    const active = computed(
        () => environments.value.find((environment) => environment.key === chosenKey.value) ?? environments.value[0],
    );

    function choose(key: string): void {
        chosenKey.value = key;
        keepStored('local', STORAGE_KEY, key);
    }

    onMounted(() => {
        chosenKey.value ??= readStored('local', STORAGE_KEY);
    });

    return { environments, active, choose };
}
