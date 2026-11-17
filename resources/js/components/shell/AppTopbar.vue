<script setup lang="ts">
import { Form, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import Button from '@/components/kit/Button.vue';
import Icon from '@/components/kit/Icon.vue';
import type { Appearance } from '@/composables/useAppearance';
import { useAppearance } from '@/composables/useAppearance';
import { logout } from '@/routes';

/**
 * The top bar (doc 4, 4.2): the page name, then the appearance switch and the signed-in person with sign out.
 */
defineProps<{ title: string }>();

const page = usePage();
const viewerName = computed(() => page.props.viewer?.name);
const { appearance, update } = useAppearance();
const choices: Appearance[] = ['light', 'dark', 'system'];
</script>

<template>
    <header
        class="flex h-12 shrink-0 items-center gap-2 border-b border-border pr-[11px] pl-4"
    >
        <span class="text-field font-medium text-text">{{ title }}</span>
        <div
            class="ml-auto inline-flex gap-0.5 rounded-button border border-border-2 p-0.5"
            role="radiogroup"
            aria-label="Appearance"
        >
            <template v-for="choice in choices" :key="choice">
                <button
                    type="button"
                    role="radio"
                    :aria-checked="appearance === choice"
                    class="rounded-seg px-2.5 py-[3px] text-small text-text-3 capitalize hover:text-text focus-visible:outline-2 focus-visible:outline-brand"
                    :class="{
                        'bg-brand-dim font-medium text-brand-text':
                            appearance === choice,
                    }"
                    @click="update(choice)"
                >
                    {{ choice }}
                </button>
            </template>
        </div>
        <template v-if="viewerName">
            <span class="text-small text-text-3">{{ viewerName }}</span>
            <Form v-bind="logout.form()">
                <Button type="submit" variant="icon" aria-label="Sign out"
                    ><Icon name="power" :size="14"
                /></Button>
            </Form>
        </template>
    </header>
</template>
