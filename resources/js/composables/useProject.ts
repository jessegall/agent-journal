import { router, usePage } from '@inertiajs/vue3';
import { computed, ref } from 'vue';
import type { ProjectData } from '@/generated/types/core';

/**
 * The header every visit names the chosen project by, and the address parameter that keeps it in the tab.
 */
export const PROJECT_HEADER = 'X-Journal-Project';
export const PROJECT_PARAMETER = 'project';

/**
 * The project named by an address, or null when the address names none and every project is shown.
 */
export function projectOfAddress(address: string): string | null {
    return new URL(address, window.location.origin).searchParams.get(PROJECT_PARAMETER);
}

/**
 * The address with its project parameter set to the project, or taken out for every project.
 */
export function addressWith(address: string, projectId: string | null): string {
    const url = new URL(address, window.location.origin);
    url.searchParams.delete(PROJECT_PARAMETER);

    if (projectId !== null) {
        url.searchParams.set(PROJECT_PARAMETER, projectId);
    }

    return url.pathname + url.search + url.hash;
}

// The tab's choice, read from the address it opened at; each tab keeps its own.
const chosen = ref<string | null>(projectOfAddress(window.location.href));

/**
 * Makes every visit, form post and partial reload name the tab's choice in its header, keeps the address naming
 * it, and takes the choice back from the address when Back or Forward moves through history.
 */
export function followProjectChoice(): void {
    router.on('before', (event) => {
        if (chosen.value !== null) {
            event.detail.visit.headers[PROJECT_HEADER] = chosen.value;
        }
    });

    router.on('navigate', (event) => {
        if (event.detail.type === 'history') {
            chosen.value = projectOfAddress(event.detail.page.url);

            return;
        }

        if (projectOfAddress(window.location.href) !== chosen.value) {
            window.history.replaceState(window.history.state, '', addressWith(window.location.href, chosen.value));
        }
    });
}

/**
 * Chooses a project, or every project with null: the visits still under way are dropped, so no answer of the
 * earlier choice lands, and the same page opens again at its start under the new one.
 */
function choose(projectId: string | null): void {
    chosen.value = projectId;
    router.cancelAll();
    router.visit(addressWith(window.location.pathname, projectId), { preserveState: false, preserveScroll: false });
}

/**
 * A project's label, with its key beside it when another project shares the label.
 */
export function projectLabel(project: ProjectData, projects: ProjectData[]): string {
    const isShared = projects.some((other) => other.id !== project.id && other.label === project.label);

    return isShared ? `${project.label} · ${project.key}` : project.label;
}

/**
 * The projects the owner may choose, as the shell shares them, and the tab's choice; nothing for a guest.
 */
export function useProject() {
    const page = usePage();
    const projects = computed(() => page.props.projects ?? []);
    const isOffered = computed(() => page.props.projects !== undefined);
    const selected = computed(() => projects.value.find((project) => project.id === chosen.value) ?? null);

    return { projects, isOffered, selected, chosen, choose };
}
