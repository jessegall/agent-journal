/** Every state a Status can show. */
export type StatusState =
    | 'working'
    | 'done'
    | 'open'
    | 'waits-on-you'
    | 'testing'
    | 'failed'
    | 'signed-in'
    | 'not-signed-in'
    | 'expired'
    | 'waiting-to-start'
    | 'running'
    | 'passed'
    | 'connecting'
    | 'restarting'
    | 'live'
    | 'ended'
    | 'stopped'
    | 'interrupted';

export interface StatusLook {
    mark: 'spinner' | 'tick' | 'alert' | 'hollow' | 'brand' | 'solid';
    word: string;
    strong?: boolean;
}

/** The mark and the word of each state: work, accounts, commands, terminal and agent bar. */
export const statusLooks: Record<StatusState, StatusLook> = {
    working: { mark: 'spinner', word: 'Working' },
    done: { mark: 'tick', word: 'Done' },
    open: { mark: 'hollow', word: 'Open' },
    'waits-on-you': { mark: 'brand', word: 'Waits on you', strong: true },
    testing: { mark: 'solid', word: 'Testing' },
    failed: { mark: 'alert', word: 'Failed' },
    'signed-in': { mark: 'solid', word: 'Signed in' },
    'not-signed-in': { mark: 'hollow', word: 'Not signed in' },
    expired: { mark: 'hollow', word: 'Expired' },
    'waiting-to-start': { mark: 'hollow', word: 'Waiting to start' },
    running: { mark: 'spinner', word: 'Running' },
    passed: { mark: 'tick', word: 'Passed' },
    connecting: { mark: 'spinner', word: 'Connecting' },
    restarting: { mark: 'spinner', word: 'Restarting' },
    live: { mark: 'brand', word: 'Live' },
    ended: { mark: 'hollow', word: 'Ended' },
    stopped: { mark: 'hollow', word: 'Stopped' },
    interrupted: { mark: 'hollow', word: 'Interrupted' },
};
