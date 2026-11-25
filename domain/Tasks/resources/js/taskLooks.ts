import type { IconName } from '@kit/Icon';
import type { StateTone } from '@kit/StateBadge';
import type { TaskStatus } from '@generated/types/tasks';

/**
 * How a task's state looks, keyed by the server's enum value: a word, a tone and an icon, so the state never rests on
 * colour alone. Blocked stays neutral; muted red is kept for errors.
 */
export const taskStateLook: Record<TaskStatus, { label: string; tone: StateTone; icon: IconName }> = {
    open: { label: 'Open', tone: 'quiet', icon: 'dot' },
    started: { label: 'Started', tone: 'busy', icon: 'start' },
    blocked: { label: 'Blocked', tone: 'quiet', icon: 'minimize' },
    finished: { label: 'Finished', tone: 'good', icon: 'tick' },
    cancelled: { label: 'Cancelled', tone: 'quiet', icon: 'close' },
};
