// Planted requests around Inertia the inertia-bypass rule must find, beside the Inertia calls it must pass.
// @sin InertiaBypassDetector
import { postJson } from '@kit/jsonRequests';
// @sin InertiaBypassDetector
import { getJson } from '@/framework/jsonRequests';
// @sin InertiaBypassDetector
import axios from 'axios';
import { router } from '@inertiajs/vue3';

export function caught(url: string): void {
    void postJson(url, {});
    void getJson(url);
    void axios.get(url);
    // @sin InertiaFetchDetector
    void fetch(url);
}

export function passed(url: string): void {
    router.reload({ only: ['page'] });
    router.post(url, {}, { only: ['page'], preserveState: true });
}
