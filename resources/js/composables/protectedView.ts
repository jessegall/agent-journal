import { router, usePage } from '@inertiajs/vue3';
import { useAppContext } from '@/framework/appContext';
import type { ActiveVisit, PendingVisit } from '@inertiajs/core';
import { ref } from 'vue';

/**
 * The generation of what the browser may show from protected sources. It moves on at once when a grant may have been
 * taken away or the connection was lost, so a view hides what it shows before anything is read again.
 */
export const protectedViewGeneration = ref(0);

/**
 * What one visit asked for: the props it requested (none named means every prop), for which user and page, and the
 * generation it started in.
 */
type VisitScope = { props: string[]; userId: string | undefined; url: string; generation: number };

/**
 * A prop is revealed by the last successful visit that requested it, in the scope it was asked in.
 */
const revealed = ref(new Map<string, VisitScope>());

const EVERY_PROP = '*';

const started = new Map<string, VisitScope>();

/**
 * The generation the page's last answered visit started in.
 */
const answeredGeneration = ref(0);

/**
 * The cancel tokens of the protected reads still in flight; a newer visit cancels them before its own starts.
 */
const inFlightReads = new Set<{ cancel: () => void }>();

const purgers = new Set<() => void>();

function currentScope(props: string[]): VisitScope {
    const page = usePage();

    return {
        props,
        userId: useAppContext().viewer.value.id,
        url: pageAddressOf(page.url),
        generation: protectedViewGeneration.value,
    };
}

/**
 * The page an address shows, without the parts Home's windows keep for themselves (window[<key>][...]): one window
 * changing its own part is still the same page for the others, and its own visit reads it again.
 */
export function pageAddressOf(url: string): string {
    const address = new URL(url, 'http://journal.local');

    for (const name of [...address.searchParams.keys()]) {
        if (name.startsWith('window[')) {
            address.searchParams.delete(name);
        }
    }

    return `${address.pathname}${address.search}`;
}

function hasSameScope(scope: VisitScope): boolean {
    const now = currentScope([]);

    return scope.userId === now.userId && scope.url === now.url && scope.generation === now.generation;
}

router.on('before', () => {
    inFlightReads.forEach((read) => read.cancel());
    inFlightReads.clear();
});
router.on('start', (event: CustomEvent<{ visit: PendingVisit }>) => {
    const visit = event.detail.visit;
    started.set(visit.id, currentScope(visit.only.length === 0 ? [EVERY_PROP] : visit.only));
});
router.on('finish', (event: CustomEvent<{ visit: ActiveVisit }>) => {
    const visit = event.detail.visit;
    const scope = started.get(visit.id);
    started.delete(visit.id);

    if (scope === undefined || !visit.completed || visit.cancelled || visit.interrupted) {
        return;
    }

    answeredGeneration.value = scope.generation;

    if (scope.generation !== protectedViewGeneration.value) {
        return;
    }

    // The answer is installed now: what it reveals is for the user and page it installed.
    const answered = currentScope(scope.props);
    const next = new Map(revealed.value);
    answered.props.forEach((prop) => next.set(prop, answered));
    revealed.value = next;
});

/**
 * Keeps a protected read's cancel token while it is in flight, so a newer visit or a navigation cancels it before
 * its late answer is installed. The answer takes the token off again.
 */
export function trackProtectedRead(token: { cancel: () => void }): () => void {
    inFlightReads.add(token);

    return () => inFlightReads.delete(token);
}

/**
 * Whether a successful visit that asked for the prop, for this user and page in the current generation, answered;
 * a visit that asked only for something else, such as the counts, reveals nothing of it.
 */
export function isRevealed(propName: string): boolean {
    revealFirstPage();
    const scope = revealed.value.get(propName) ?? revealed.value.get(EVERY_PROP);

    return scope !== undefined && hasSameScope(scope);
}

let hasLoadedFirstPage = false;

/**
 * The page the browser loaded first came with every prop for its user, before any visit; it counts as revealed
 * until the generation first moves on.
 */
function revealFirstPage(): void {
    if (hasLoadedFirstPage) {
        return;
    }

    hasLoadedFirstPage = true;

    if (protectedViewGeneration.value === 0 && revealed.value.size === 0) {
        revealed.value = new Map([[EVERY_PROP, currentScope([EVERY_PROP])]]);
    }
}

/**
 * Moves the generation on, so what views show is hidden until a read started from now on answers.
 */
export function clearProtectedViews(): void {
    protectedViewGeneration.value++;
}

/**
 * Access was denied: what protected views show is hidden and forgotten, and every registered purger (drafts,
 * overlays, recovery data) clears its own part.
 */
export function purge(): void {
    clearProtectedViews();
    revealed.value = new Map();
    purgers.forEach((purger) => purger());
}

/**
 * Registers what a view clears on a denial; the answer takes it off again.
 */
export function onPurge(purger: () => void): () => void {
    purgers.add(purger);

    return () => purgers.delete(purger);
}

/**
 * Whether the page's current answer was asked for in the current generation.
 */
export function isAnswerCurrent(): boolean {
    return answeredGeneration.value === protectedViewGeneration.value;
}
