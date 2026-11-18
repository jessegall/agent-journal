<script setup lang="ts">
import { router, useForm } from '@inertiajs/vue3';
import type { RecordCard } from '@kit/CoreTypes';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * The records this one is linked to that you may see, each opening its own page, and the picker that links another
 * record by its reference, such as task 7 or plan 3.
 */
const props = defineProps<{ source: string; links: RecordCard[] }>();

const form = useForm({ source: props.source, target: '' });

function add(): void {
    form.post('/links/add', { preserveScroll: true, onSuccess: () => form.reset('target'), ...formSendingHooks() });
}

function remove(link: RecordCard): void {
    router.post('/links/remove', { source: props.source, target: link.label }, { preserveScroll: true, ...formSendingHooks() });
}
</script>

<template>
    <section class="flex flex-col gap-2">
        <h2 class="text-heading">Links</h2>
        <template v-for="link in links" :key="link.id">
            <div class="flex items-center gap-2">
                <a :href="link.route ?? undefined" class="flex gap-2">
                    <span class="font-mono tabular-nums">{{ link.label }}</span>
                    <span>{{ link.title }}</span>
                </a>
                <Button @click="remove(link)">Remove</Button>
            </div>
        </template>
        <form class="flex gap-2" @submit.prevent="add">
            <input v-model="form.target" class="input flex-1" maxlength="64" placeholder="Link to, such as task 7 or plan 3" />
            <Button type="submit" :pending="form.processing" :disabled="form.processing || form.target.trim() === ''">Add link</Button>
            <FormErrors :errors="form.errors" />
        </form>
    </section>
</template>
