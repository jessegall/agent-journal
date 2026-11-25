<script setup lang="ts">
import { computed } from 'vue';
import { useAppContext } from '@/framework/appContext';
import Icon from './Icon.vue';

/**
 * A driver's own product mark, as its family declares it on the server: a mark in its own colours is drawn as an
 * image, so it keeps them in light and dark, and a mark in the text colour as a mask, so it follows light and dark.
 * A driver no family declares gets the neutral users icon.
 */
const props = withDefaults(
    defineProps<{
        driver: string;
        size?: 12 | 14 | 16 | 18;
    }>(),
    { size: 16 },
);

const { driverLook } = useAppContext();
const shown = computed(() => driverLook(props.driver));
</script>

<template>
    <template v-if="shown.type === 'declared' && shown.look.markTone === 'own'">
        <img
            :src="shown.look.markUrl"
            :width="size"
            :height="size"
            alt=""
            aria-hidden="true"
            class="block flex-none"
            :data-driver="shown.look.family"
        />
    </template>
    <template v-else-if="shown.type === 'declared'">
        <span
            aria-hidden="true"
            class="block flex-none bg-current"
            :style="{
                width: `${size}px`,
                height: `${size}px`,
                maskImage: `url(${shown.look.markUrl})`,
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
            }"
            :data-driver="shown.look.family"
        />
    </template>
    <template v-else>
        <Icon name="users" :size="size" class="text-text-3" />
    </template>
</template>
