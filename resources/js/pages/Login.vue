<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import { store } from '@/routes/login';
import type { LoginPage } from '@/types/generated';

const props = defineProps<{ page: LoginPage }>();

const input = computed(() => props.page.input);
</script>

<template>
    <main
        class="flex min-h-screen items-center justify-center bg-neutral-50 p-6"
    >
        <Head title="Sign in" />
        <Form
            v-slot="{ errors, processing }"
            v-bind="store.form()"
            :reset-on-success="['password']"
            class="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6"
        >
            <h1 class="text-lg font-semibold">Sign in</h1>
            <label class="flex flex-col gap-1 text-sm">
                Email
                <input
                    name="email"
                    type="email"
                    autocomplete="username"
                    required
                    :value="input.email"
                    class="rounded border border-neutral-300 px-3 py-2"
                />
                <template v-if="errors.email">
                    <span class="text-red-600">{{ errors.email }}</span>
                </template>
            </label>
            <label class="flex flex-col gap-1 text-sm">
                Password
                <input
                    name="password"
                    type="password"
                    :value="input.password"
                    autocomplete="current-password"
                    required
                    class="rounded border border-neutral-300 px-3 py-2"
                />
                <template v-if="errors.password">
                    <span class="text-red-600">{{ errors.password }}</span>
                </template>
            </label>
            <label class="flex items-center gap-2 text-sm">
                <input
                    name="remember"
                    type="checkbox"
                    :checked="input.remember"
                />
                Keep me signed in
            </label>
            <button
                type="submit"
                :disabled="processing"
                class="rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                Sign in
            </button>
        </Form>
    </main>
</template>
