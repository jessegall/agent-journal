import { usePage } from '@inertiajs/vue3';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import type { InstallationData, NavigationCountsData, NavigationData, ViewerData } from '@/types/generated';

/**
 * The app context every page receives, read from the page props as AppContextData types it: the installation, the
 * viewer, the navigation and its counts (a signed-in viewer's alone, the counts arriving after the page) and the code
 * of the refusal the last form was answered with.
 */
export type AppContext = {
    installation: ComputedRef<InstallationData>;
    viewer: ComputedRef<ViewerData>;
    navigation: ComputedRef<NavigationData | undefined>;
    navigationCounts: ComputedRef<NavigationCountsData | undefined>;
    refusalCode: ComputedRef<string | undefined>;
};

export function useAppContext(): AppContext {
    const page = usePage();

    return {
        installation: computed(() => page.props.installation),
        viewer: computed(() => page.props.viewer),
        navigation: computed(() => page.props.navigation),
        navigationCounts: computed(() => page.props.navigationCounts),
        refusalCode: computed(() => page.props.refusalCode),
    };
}
