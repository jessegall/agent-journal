import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import type { AuthorizerCallback } from 'pusher-js';
import { traceLive } from '@/composables/liveTrace';

/**
 * The one websocket connection of the browser tab, to Reverb, for one signed-in user at a time. It is opened by the
 * app shell and never on the server render.
 */
export type UserConnection = {
    userId: string;
    leave: () => void;
};

/**
 * What the connection tells its owner: a page change, a protected view to clear, notifications to read again, the
 * private channel signed in to
 * (first and after every reconnect, when changes may have been missed), the transport lost, and a refused sign-in.
 */
export type LiveHandlers = {
    onChange: () => void;
    onProtectedViewInvalidated: () => void;
    onNotificationsChanged: () => void;
    onChatAccessEnded: (inboxId: string) => void;
    onSubscribed: () => void;
    onLost: () => void;
    onRefused: () => void;
};

/**
 * Opens the connection for a user and listens on their private channel.
 */
export function connectUser(userId: string, handlers: LiveHandlers): UserConnection {
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
    let isConnected = false;

    echo.private(channelName)
        .subscribed(() => {
            traceLive('subscription authorized');
            handlers.onSubscribed();
        })
        .error(() => {
            traceLive('subscription refused');
            handlers.onRefused();
        })
        .listen('.page.changed', () => {
            traceLive('signal received');
            handlers.onChange();
        })
        // A chat the user left, was removed from or saw closed: the page is read again without it.
        .listen('.inbox.access-ended', (notice: { inboxId: string }) => {
            traceLive('chat access ended');
            handlers.onChatAccessEnded(notice.inboxId);
            handlers.onChange();
        })
        .listen('.view.protected-invalidated', handlers.onProtectedViewInvalidated)
        .listen('.notifications.changed', handlers.onNotificationsChanged);
    echo.connector.pusher.connection.bind(
        'state_change',
        (states: { current: string }) => {
            if (states.current === 'connected') {
                isConnected = true;
                traceLive('transport connected');

                return;
            }

            if (isConnected) {
                isConnected = false;
                traceLive('transport lost');
                handlers.onLost();
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
 * The journal refused to sign the browser in to a private channel.
 */
class ChannelSignInRefused extends Error {
    static for(status: number): ChannelSignInRefused {
        return new ChannelSignInRefused(`The channel sign-in was refused with ${status}.`);
    }
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
        throw ChannelSignInRefused.for(response.status);
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
