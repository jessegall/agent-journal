/**
 * The timer behind the viewer's heartbeat: one beat at start and one every interval, never two in flight; a refused
 * sign-in (401 or 419) stops it until it is started again, any other failure waits for the next tick, and `beatNow`
 * sends at once.
 */
export interface PresenceHeartbeat {
    start(): void;
    stop(): void;
    beatNow(): void;
}

/**
 * Answers with the response status, or throws when the request never reached the server.
 */
export type HeartbeatSender = () => Promise<number>;

const SIGN_IN_REFUSED = [401, 419];

export function presenceHeartbeat(
    send: HeartbeatSender,
    intervalMilliseconds: number,
): PresenceHeartbeat {
    let timer: ReturnType<typeof setInterval> | undefined;
    let pending = false;

    function stop(): void {
        clearInterval(timer);
        timer = undefined;
    }

    function beatNow(): void {
        if (timer === undefined || pending) {
            return;
        }

        pending = true;
        send()
            .then((status) => {
                if (SIGN_IN_REFUSED.includes(status)) {
                    stop();
                }
            })
            .catch(() => undefined)
            .finally(() => {
                pending = false;
            });
    }

    function start(): void {
        if (timer !== undefined) {
            return;
        }

        timer = setInterval(beatNow, intervalMilliseconds);
        beatNow();
    }

    return { start, stop, beatNow };
}
