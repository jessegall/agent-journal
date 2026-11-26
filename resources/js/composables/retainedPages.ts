import { watch } from 'vue';
import { liveGeneration } from './useLiveConnection';

/**
 * The one way a retained list receives a reconnect: each mounted list that keeps pages registers what it reads again,
 * and after every reconnect but the first sign-in it reads each of its pages again under the current authorisation,
 * drops what is refused before showing new rows, and takes arrivals once by id. Drafts live elsewhere and stay.
 */
export function onReconnected(readAgain: () => void): void {
    watch(liveGeneration, (generation, previous) => {
        if (previous > 0 && generation > previous) {
            readAgain();
        }
    });
}
