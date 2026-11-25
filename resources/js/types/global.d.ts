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
import type { AppContextData, InstallationData, ViewerData } from './generated';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        // The generator prints a lazy field as optional, while the server sends the installation on every full visit and
        // the viewer on every response, and a partial reload keeps both.
        sharedPageProps: AppContextData & { installation: InstallationData; viewer: ViewerData };
        // What a page action flashes with its redirect back: a notice the toast region shows, and any value a form
        // reads from its own answer, such as the id of what it made.
        flashDataType: { notice?: string; [key: string]: unknown };
    }
}

declare global {
    interface Window {
        /** The live connection's last milestones, read from the browser console. */
        journalLiveTrace?: () => LiveTraceEntry[];
    }
}

export {};
