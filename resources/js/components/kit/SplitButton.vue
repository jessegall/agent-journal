<script setup lang="ts">
import Button from './Button.vue';
import Icon, { type IconName } from './Icon.vue';
import Menu from './Menu.vue';
import Tooltip from './Tooltip.vue';

/**
 * A create action whose second way sits behind a chevron: a main button with its icon and label, and a chevron named
 * More ways to create a <noun> that opens a Menu of the other ways. The hint is the main half's tooltip, and disabled
 * disables both halves. Measures: docs/designs/kit-components.md.
 */
defineProps<{ label: string; icon?: IconName; hint: string; noun: string; disabled?: boolean }>();

const emit = defineEmits<{ create: [] }>();
</script>

<template>
    <div class="inline-flex">
        <Tooltip :text="hint">
            <template #default="{ describedBy }">
                <Button
                    variant="bordered"
                    size="small"
                    :disabled="disabled"
                    :aria-describedby="describedBy"
                    class="rounded-r-none bg-background text-text focus-visible:z-10"
                    @click="emit('create')"
                >
                    <template v-if="icon !== undefined">
                        <Icon :name="icon" :size="14" />
                    </template>
                    {{ label }}
                </Button>
            </template>
        </Tooltip>
        <Menu
            :label="`More ways to create a ${noun}`"
            :disabled="disabled"
            :trigger-class="'h-6 rounded-l-none rounded-r-button border border-l-0 border-border-2 bg-background px-1.5 text-text hover:bg-hover focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'"
        >
            <template #trigger>
                <Icon name="caret" :size="14" />
            </template>
            <slot />
        </Menu>
    </div>
</template>
