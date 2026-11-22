<script setup lang="ts">
import Button from './Button.vue';
import Icon, { type IconName } from './Icon.vue';
import Menu from './Menu.vue';
import Tooltip from './Tooltip.vue';

/**
 * A create action whose second way sits behind a chevron: a main Button (an Icon and the label) and a chevron that
 * opens a Menu of the other ways, which are the default slot's MenuGroup and MenuItems. Both halves have a --border-2
 * border on --bg in --text; the main half is round on its left (7px), the chevron on its right with no left border and
 * a padding of 6, and each has its own hover and its own focus ring, raised above its neighbour. The hint, when given,
 * is the main half's Tooltip (the plain way, spelled out). The chevron has aria-haspopup menu and the name "More ways to create a <noun>". A
 * disabled button disables both halves.
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
