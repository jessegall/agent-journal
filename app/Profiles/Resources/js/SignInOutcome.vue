<script setup lang="ts">
import type {
    SignInAttemptData,
    SignInMethodData,
} from '@generated/types/accounts';
import Spinner from '@kit/Spinner';
import ChosenSignIn from './ChosenSignIn.vue';
import { driverName } from './accountLooks';
import { endedMessage } from './signIn';

/**
 * The wizard's third step: the check while the host proves the sign-in, then the account added, the account that
 * was already there, or what went wrong in the attempt's own sentence. The done mark is blue, every other mark grey.
 */
defineProps<{
    driver: string;
    method: SignInMethodData;
    attempt: SignInAttemptData;
    accountName: string | null;
}>();
</script>

<template>
    <ChosenSignIn :driver="driver" :method="method" />
    <div
        class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
        role="status"
    >
        <template v-if="attempt.state === 'checking'">
            <Spinner large class="text-brand" />
            <h4 class="mt-1 font-semibold text-card text-text">
                Checking the sign-in with {{ driverName(driver) }}…
            </h4>
            <p class="max-w-[340px] text-field leading-relaxed text-text-2">
                This usually takes a few seconds. You can close this window: the
                account appears in the list when it is ready.
            </p>
        </template>
        <template v-else-if="attempt.state === 'complete'">
            <span
                class="flex size-10 items-center justify-center rounded-full bg-brand-dim text-lg font-semibold text-brand-text"
                data-mark="done"
                >✓</span
            >
            <h4 class="mt-1 font-semibold text-card text-text">Account added</h4>
            <p class="max-w-[340px] text-field leading-relaxed text-text-2">
                <b class="font-medium [overflow-wrap:anywhere] text-text">{{
                    accountName ?? driverName(driver)
                }}</b>
                is saved as a {{ driverName(driver) }} account.
            </p>
        </template>
        <template v-else-if="attempt.state === 'already_added'">
            <span
                class="flex size-10 items-center justify-center rounded-full bg-chip text-lg font-semibold text-text-3"
                data-mark="grey"
                >=</span
            >
            <h4 class="mt-1 font-semibold text-card text-text">
                {{ endedMessage(attempt) }}
            </h4>
            <p class="max-w-[340px] text-field leading-relaxed text-text-2">
                <template v-if="accountName !== null">
                    It is
                    <b class="font-medium [overflow-wrap:anywhere] text-text">{{
                        accountName
                    }}</b>
                    in the list.
                </template>
                To renew it, choose Sign in again on the account.
            </p>
        </template>
        <template v-else>
            <span
                class="flex size-10 items-center justify-center rounded-full bg-chip text-lg font-semibold text-text-3"
                data-mark="grey"
                >!</span
            >
            <h4 class="mt-1 font-semibold text-card text-text">
                {{ endedMessage(attempt) }}
            </h4>
            <p class="max-w-[340px] text-field leading-relaxed text-text-2">
                {{
                    method.isSecret
                        ? `Nothing was saved. Start again with another ${method.title.toLowerCase()}, or choose another way to sign in.`
                        : 'Nothing was saved. Start again for a new sign-in page, or choose another way to sign in.'
                }}
            </p>
        </template>
    </div>
</template>
