import { onMounted, ref } from 'vue';

export type Appearance = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'appearance';

/**
 * Light, dark or following the system (the default, choice 23). It touches the browser only once mounted, so server
 * rendering never reads window or localStorage.
 */
export function useAppearance() {
    const appearance = ref<Appearance>('system');

    function prefersDark(): boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function apply(value: Appearance): void {
        const isDark =
            value === 'dark' || (value === 'system' && prefersDark());

        document.documentElement.classList.toggle('dark', isDark);
    }

    function update(value: Appearance): void {
        appearance.value = value;
        localStorage.setItem(STORAGE_KEY, value);
        apply(value);
    }

    onMounted(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        appearance.value =
            stored === 'light' || stored === 'dark' ? stored : 'system';
        apply(appearance.value);
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => apply(appearance.value));
    });

    return { appearance, update };
}
