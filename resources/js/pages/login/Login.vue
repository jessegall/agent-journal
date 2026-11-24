<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import Button from '@/components/kit/Button.vue';
import Input from '@/components/kit/Input.vue';
import Toggle from '@/components/kit/Toggle.vue';
import { ref } from 'vue';
import { store } from '@/routes/login';
import type { LoginPage } from '@/types/generated';

const props = defineProps<{ page: LoginPage }>();

const email = ref(props.page.input.email);
const password = ref(props.page.input.password);
const remember = ref(props.page.input.shouldRemember);
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
                <Input v-model="email" name="email" type="email" autocomplete="username" required />
                <template v-if="errors.email">
                    <span class="text-red-600">{{ errors.email }}</span>
                </template>
            </label>
            <label class="flex flex-col gap-1 text-sm">
                Password
                <Input v-model="password" name="password" type="password" autocomplete="current-password" required />
                <template v-if="errors.password">
                    <span class="text-red-600">{{ errors.password }}</span>
                </template>
            </label>
            <label class="flex items-center gap-2 text-sm">
                <Toggle v-model="remember" name="remember" label="Keep me signed in" />
                Keep me signed in
            </label>
            <Button type="submit" variant="primary" :pending="processing">Sign in</Button>
        </Form>
    </main>
</template>
