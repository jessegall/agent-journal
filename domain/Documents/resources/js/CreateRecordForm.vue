<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import FormErrors from '@kit/FormErrors';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * Files a new document or report; the server checks every limit and its errors show under the form.
 */
const props = defineProps<{ action: string; label: string }>();

const form = useForm({ title: '', abstract: '', body: '', about: '' });

function submit(): void {
    form.transform((fields) => ({ ...fields, about: fields.about.split(',').map((reference) => reference.trim()).filter((reference) => reference !== '') })).post(props.action, {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        ...formSendingHooks(),
    });
}
</script>

<template>
    <form class="flex flex-col gap-2" @submit.prevent="submit">
        <input v-model="form.title" class="input" placeholder="Title" />
        <input v-model="form.abstract" class="input" placeholder="One line saying what it is" />
        <textarea v-model="form.body" class="input" rows="6" placeholder="Markdown text" />
        <input v-model="form.about" class="input" placeholder="What it is about, such as task 12, plan 3" />
        <Button type="submit" variant="primary" :pending="form.processing">{{ label }}</Button>
        <FormErrors :errors="form.errors" />
    </form>
</template>
