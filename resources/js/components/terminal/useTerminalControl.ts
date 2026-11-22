import type { TerminalControlData } from '@generated/types/core';
import { getJson, JsonRequestFailed, postJson } from '@/framework/jsonRequests';
import { newRequestId } from '@/kit/requestId';
import {
    cancelPrivateEntry,
    cancelTerminalTake,
    checkTerminalScreen,
    chooseTerminalDraft,
    openPrivateEntry,
    releaseTerminalControl,
    renewTerminalControl,
    sendTerminalInput,
    submitPrivateInput,
    takeTerminalControl,
    terminalControl,
} from '@/routes/web';
import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import type { ControlFailure, ControlView, TerminalControlClient } from './terminalControl';
import { CONTROL_RENEW_MILLISECONDS, TerminalControl } from './terminalControl';
import type { TerminalScreen } from './terminalSubscription';

async function answered(request: Promise<TerminalControlData | null>): Promise<TerminalControlData> {
    return (await request) as TerminalControlData;
}

function clientFor(agentId: string): TerminalControlClient {
    return {
        take: (interest, takeId) => answered(postJson(takeTerminalControl.url(agentId), { interest, takeId })),
        cancel: (takeId) => answered(postJson(cancelTerminalTake.url(agentId), { takeId })),
        renew: (grantId) => answered(postJson(renewTerminalControl.url(agentId), { grantId })),
        release: (grantId) => answered(postJson(releaseTerminalControl.url(agentId), { grantId })),
        input: (grantId, input, sequence, screenRevision) =>
            answered(postJson(sendTerminalInput.url(agentId), { grantId, ...input, sequence, screenRevision })),
        choose: (grantId, choice, sequence) =>
            answered(postJson(chooseTerminalDraft.url(agentId), { grantId, choice, sequence })),
        check: (grantId) => answered(postJson(checkTerminalScreen.url(agentId), { grantId })),
        openPrivate: (grantId, sequence) => answered(postJson(openPrivateEntry.url(agentId), { grantId, sequence })),
        submitPrivate: (grantId, submissionId, value, sequence) =>
            answered(postJson(submitPrivateInput.url(agentId), { grantId, submissionId, value, sequence })),
        cancelPrivate: (grantId) => answered(postJson(cancelPrivateEntry.url(agentId), { grantId })),
        receipt: (takeId, sequence) =>
            getJson<TerminalControlData>(terminalControl.url(agentId, { query: { takeId, sequence } })),
    };
}

function failureOf(failure: unknown): ControlFailure {
    if (failure instanceof JsonRequestFailed) {
        return { kind: failure.kind, code: failure.code, message: failure.message };
    }

    return { kind: 'lost', code: '', message: '' };
}

/**
 * A view's control of the agent's terminal beside its read: it takes through the view's own read interest, renews
 * every 10 seconds while it holds the grant, and drops control at once when the view hides, the agent changes, the
 * read is refused or ended, or the screen's identity or privacy revision changes.
 */
export function useTerminalControl(
    agentId: Ref<string>,
    readInterest: () => string,
    screen: Ref<TerminalScreen>,
    isShown: Ref<boolean>,
) {
    const view = shallowRef<ControlView>({
        state: 'watching',
        notice: '',
        unsentLine: '',
        savedDrafts: [],
        geometry: '',
        privateEntry: false,
    });
    let control = controlFor(agentId.value);

    function promptRevision(): number {
        return screen.value.frame?.promptRevision ?? 0;
    }
    let renewal = 0;

    function controlFor(agent: string): TerminalControl {
        return new TerminalControl(
            clientFor(agent),
            newRequestId,
            (shown) => (view.value = shown),
            failureOf,
            (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds)),
        );
    }

    watch(agentId, (agent) => {
        control.erase();
        control = controlFor(agent);
    });
    watch(isShown, (shown) => {
        if (!shown) {
            control.retire();
        }
    });
    watch(
        () => [screen.value.frame?.privacyRevision, screen.value.frame?.stream, screen.value.frame?.epoch],
        (now, before) => {
            if (before.some((part, place) => part !== undefined && part !== now[place])) {
                control.retire('Control ended because the screen changed.');
            }
        },
    );
    watch(
        () => screen.value.state,
        (state) => {
            if (state === 'refused' || state === 'ended') {
                control.erase();
            }
        },
    );
    watch(
        () => screen.value.reconnecting,
        (reconnecting) => {
            if (reconnecting) {
                control.retire('Input stopped while the terminal reconnects.');
            }
        },
    );

    function stopWhenHidden(): void {
        if (document.visibilityState === 'hidden') {
            control.retire();
        }
    }

    function stopForPage(): void {
        control.retire();
    }

    onMounted(() => {
        document.addEventListener('visibilitychange', stopWhenHidden);
        document.addEventListener('freeze', stopForPage);
        window.addEventListener('pagehide', stopForPage);
        renewal = window.setInterval(() => void control.renew(), CONTROL_RENEW_MILLISECONDS);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('visibilitychange', stopWhenHidden);
        document.removeEventListener('freeze', stopForPage);
        window.removeEventListener('pagehide', stopForPage);
        window.clearInterval(renewal);
        control.retire();
    });

    return {
        view,
        take: () => control.take(readInterest()),
        cancel: () => control.cancel(),
        giveBack: () => control.giveBack(),
        keepTyping: () => control.keepTyping(),
        choose: (choice: 'send' | 'save-and-clear') => control.choose(choice),
        check: () => control.check(),
        send: (text: string, enter: boolean) => control.send(text, enter, promptRevision()),
        sendKey: (key: string) => control.sendInput({ kind: 'key', key }, promptRevision()),
        paste: (text: string) => control.sendInput({ kind: 'paste', text }, promptRevision()),
        resize: (rows: number, columns: number) =>
            control.sendInput({ kind: 'resize', rows, columns }, promptRevision()),
        promptRevision,
        deleteSavedDraft: (index: number) => control.deleteSavedDraft(index),
        openPrivate: () => control.openPrivate(),
        submitPrivate: (value: string) => control.submitPrivate(value),
        cancelPrivate: () => control.cancelPrivate(),
        holdsGrant: () => control.holdsGrant(),
        mayTake: () => {
            const frame = screen.value.frame;

            return (
                screen.value.state === 'live' &&
                !screen.value.reconnecting &&
                frame !== null &&
                !frame.tooLarge &&
                !frame.unreadable &&
                !frame.noTerminal
            );
        },
    };
}

export type TerminalControlHandle = ReturnType<typeof useTerminalControl>;
