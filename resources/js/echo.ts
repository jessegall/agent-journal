import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import type { AuthorizerCallback } from 'pusher-js';

/**
 * The one websocket connection of the browser tab, to Reverb, for one signed-in user at a time. It is opened by the
 * app shell and never on the server render.
 */
export type UserConnection = {
    userId: string;
    leave: () => void;
};

/**
 * Opens the connection for a user and listens on their private channel; onChange hears each page change and
 * onReconnect hears that the connection came back after it was lost, when changes may have been missed.
 */
export function connectUser(
    userId: string,
    onChange: () => void,
    onReconnect: () => void,
): UserConnection {
    const echo = new Echo({
        broadcaster: 'reverb',
        Pusher,
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT),
        forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
        enabledTransports: ['ws', 'wss'],
        authorizer: (channel: { name: string }) => ({
            authorize: (socketId: string, callback: AuthorizerCallback) => {
                void signInToChannel(channel.name, socketId).then(
                    (data) => callback(null, data),
                    (error: Error) => callback(error, null),
                );
            },
        }),
    });
    const channelName = `journal.user.${userId}`;
    let wasLost = false;

    echo.private(channelName).listen('.page.changed', onChange);
    echo.connector.pusher.connection.bind(
        'state_change',
        (states: { current: string }) => {
            if (
                states.current === 'unavailable' ||
                states.current === 'disconnected'
            ) {
                wasLost = true;
            }

            if (states.current === 'connected' && wasLost) {
                wasLost = false;
                onReconnect();
            }
        },
    );

    return {
        userId,
        leave: () => {
            echo.leave(channelName);
            echo.disconnect();
        },
    };
}

/**
 * Asks the server whether this tab may listen on a private channel, with the session's current XSRF token read at
 * that moment, so a sign-in after a reconnect uses a fresh one.
 */
async function signInToChannel(
    channelName: string,
    socketId: string,
): Promise<{ auth: string }> {
    const response = await fetch('/broadcasting/auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        body: JSON.stringify({
            socket_id: socketId,
            channel_name: channelName,
        }),
    });

    if (!response.ok) {
        throw new Error(
            `The channel sign-in was refused with ${response.status}.`,
        );
    }

    return (await response.json()) as { auth: string };
}

/**
 * The session's current XSRF token, read from its cookie at the moment of the call.
 */
export function xsrfToken(): string {
    const cookie = document.cookie
        .split('; ')
        .find((part) => part.startsWith('XSRF-TOKEN='));

    return cookie === undefined
        ? ''
        : decodeURIComponent(cookie.slice('XSRF-TOKEN='.length));
}
