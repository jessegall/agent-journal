import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import { pageChanged } from './usePageChanges';

/**
 * The generation of what the browser may show from protected sources. It moves on at once when a grant may have been
 * taken away or the connection came back, so a view clears what it shows before anything is read again; an answer is
 * shown only when its request started in the current generation.
 */
export const protectedViewGeneration = ref(0);

/**
 * The generation of the last answered request, as it was when that request started.
 */
const answeredGeneration = ref(0);

let startedGeneration = 0;

router.on('start', () => {
    startedGeneration = protectedViewGeneration.value;
});
router.on('success', () => {
    answeredGeneration.value = startedGeneration;
});

/**
 * Moves the generation on before the page is read again, so what views show is cleared first.
 */
export function invalidateProtectedViews(): void {
    protectedViewGeneration.value++;
    pageChanged();
}

/**
 * Whether the page's current answer was asked for in the current generation.
 */
export function isAnswerCurrent(): boolean {
    return answeredGeneration.value === protectedViewGeneration.value;
}
