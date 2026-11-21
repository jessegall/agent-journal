// Extend ImportMeta interface for Vite...
declare module 'vite/client' {
    interface ImportMetaEnv {
        readonly VITE_APP_NAME: string;
        readonly VITE_REVERB_APP_KEY: string;
        readonly VITE_REVERB_HOST: string;
        readonly VITE_REVERB_PORT: string;
        readonly VITE_REVERB_SCHEME: string;
        [key: string]: string | boolean | undefined;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
        readonly glob: <T>(pattern: string) => Record<string, () => Promise<T>>;
    }
}

import type { LiveTraceEntry } from '@/composables/liveTrace';
import type { SharedData } from './generated';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: SharedData;
    }
}

declare global {
    interface Window {
        /** The live connection's last milestones, read from the browser console. */
        journalLiveTrace?: () => LiveTraceEntry[];
    }
}

export {};
