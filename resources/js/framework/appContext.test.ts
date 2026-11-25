import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import type { AppContextData, DriverLookData, InstallationData, ViewerData } from '@/types/generated';
import { useAppContext } from './appContext';

const page = reactive<{
    props: AppContextData & { installation: InstallationData; viewer: ViewerData; drivers: DriverLookData[] };
}>({
    props: {
        installation: { name: 'Journal', version: '012345678', faults: [] },
        viewer: { type: 'guest', canShare: false },
        drivers: [],
    },
});

vi.mock('@inertiajs/vue3', () => ({ usePage: () => page }));

describe('the app context', () => {
    it('reads a guest, who has no navigation', () => {
        const context = useAppContext();

        expect(context.installation.value.version).toBe('012345678');
        expect(context.viewer.value.type).toBe('guest');
        expect(context.navigation.value).toBeUndefined();
        expect(context.navigationCounts.value).toBeUndefined();
    });

    it('follows the page props when the viewer signs in and its counts arrive after the page', () => {
        const context = useAppContext();

        page.props.viewer = { type: 'owner', id: 'user-1', name: 'Owner', canShare: true };
        page.props.installation = { name: 'Journal', version: '012345678', faults: ['The queue is down.'] };
        page.props.navigation = { items: [], groups: [], current: [] };

        expect(context.viewer.value.id).toBe('user-1');
        expect(context.installation.value.faults).toEqual(['The queue is down.']);
        expect(context.navigationCounts.value).toBeUndefined();

        page.props.navigationCounts = { counts: { 'plans.open': 2 } };

        expect(context.navigationCounts.value?.counts['plans.open']).toBe(2);
    });
});

describe('a driver look', () => {
    it('is found by family, alias or vendor name, and an unknown driver keeps its recorded name', () => {
        page.props.drivers = [
            {
                family: 'acme',
                label: 'Acme',
                aliases: ['acme-headless'],
                markUrl: '/images/drivers/acme.svg',
                markTone: 'own',
                signInCode: 'outgoing',
            },
        ];
        const { driverLook } = useAppContext();

        expect(driverLook('acme')).toMatchObject({ type: 'declared', look: { label: 'Acme' } });
        expect(driverLook('acme-headless')).toMatchObject({ type: 'declared', look: { family: 'acme' } });
        expect(driverLook('vendor/acme')).toMatchObject({ type: 'declared', look: { family: 'acme' } });
        expect(driverLook('gone')).toEqual({ type: 'unknown', label: 'gone' });
    });
});
