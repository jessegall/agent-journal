import { usePage } from '@inertiajs/vue3';
import type { ComputedRef } from 'vue';
import { computed } from 'vue';
import type {
    DriverLookData,
    InstallationData,
    NavigationCountsData,
    NavigationData,
    ViewerData,
} from '@/types/generated';

/**
 * The app context every page receives, read from the page props as AppContextData types it: the installation, the
 * viewer, how each driver family is shown, the navigation and its counts (a signed-in viewer's alone, the counts arriving after the page) and the code
 * of the refusal the last form was answered with.
 */
export type AppContext = {
    installation: ComputedRef<InstallationData>;
    viewer: ComputedRef<ViewerData>;
    drivers: ComputedRef<DriverLookData[]>;
    driverLook: (driver: string) => DriverLook;
    driverLabel: (driver: string) => string;
    navigation: ComputedRef<NavigationData | undefined>;
    navigationCounts: ComputedRef<NavigationCountsData | undefined>;
    refusalCode: ComputedRef<string | undefined>;
};

/**
 * How a recorded driver is shown: the look its family declares, or, for a driver no family declares now, such as one
 * removed since, its recorded name with a neutral mark.
 */
export type DriverLook = { type: 'declared'; look: DriverLookData } | { type: 'unknown'; label: string };

export function useAppContext(): AppContext {
    const page = usePage();

    return {
        installation: computed(() => page.props.installation),
        viewer: computed(() => page.props.viewer),
        drivers: computed(() => page.props.drivers),
        driverLook: (driver) => lookOf(page.props.drivers, driver),
        driverLabel: (driver) => labelOf(lookOf(page.props.drivers, driver)),
        navigation: computed(() => page.props.navigation),
        navigationCounts: computed(() => page.props.navigationCounts),
        refusalCode: computed(() => page.props.refusalCode),
    };
}

/**
 * The look of the family a driver name belongs to: its family key, one of its aliases, or a vendor's name for it
 * (vendor/<family>).
 */
function lookOf(drivers: DriverLookData[], driver: string): DriverLook {
    const family = driver.slice(driver.indexOf('/') + 1);
    const look = drivers.find(
        (candidate) => [driver, family].includes(candidate.family) || candidate.aliases.includes(driver),
    );

    return look === undefined ? { type: 'unknown', label: driver } : { type: 'declared', look };
}

/**
 * The name a driver goes by on the page: its family's label, or the recorded name of a driver no family declares.
 */
function labelOf(shown: DriverLook): string {
    return shown.type === 'declared' ? shown.look.label : shown.label;
}
