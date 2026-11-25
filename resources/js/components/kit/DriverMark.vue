<script setup lang="ts">
import { computed } from 'vue';
import { useAppContext } from '@/framework/appContext';
import DriverIcon from './DriverIcon.vue';

/**
 * The mark of an agent's driver, as the design draws it: the mark its family declares, named by the family's label,
 * whether the driver is recorded by its family, an alias or a vendor's name for it; any other driver keeps its recorded
 * name beside the neutral mark. It is 11 px inside a small avatar and 16 px in rows and a large avatar.
 */
const props = withDefaults(defineProps<{ driver: string; size?: 11 | 16 }>(), { size: 16 });

const { driverLabel } = useAppContext();
const label = computed(() => driverLabel(props.driver));
</script>

<template>
    <span class="inline-flex text-text" :title="label" role="img" :aria-label="label">
        <DriverIcon :driver="driver" :size="size === 11 ? 12 : 16" />
    </span>
</template>
