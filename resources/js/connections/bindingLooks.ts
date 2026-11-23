import type { BindingReadiness } from '@generated/types/connections';

/**
 * How a connected folder's state reads in the list: its label and the badge tone it is drawn in.
 */
export const bindingLooks: Record<
    BindingReadiness,
    { label: string; tone: 'good' | 'warn' | 'danger' | 'busy' | 'quiet' }
> = {
    pending: { label: 'Setting up', tone: 'busy' },
    ready: { label: 'Ready', tone: 'good' },
    offline: { label: 'Offline', tone: 'quiet' },
    revoked: { label: 'Revoked', tone: 'danger' },
};
