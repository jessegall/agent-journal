<script setup lang="ts" generic="TKey extends string, TSubject extends Record<TKey, string>">
/**
 * Renders the slot named for the subject's case, read from its `by` field, and hands the slot the subject narrowed
 * to that case, so a case never tests its value again to reach its own fields.
 */
import SwitchCase from './SwitchCase.vue';

defineProps<{
    subject: TSubject;
    by: TKey;
}>();

defineSlots<{
    [TCase in TSubject[TKey]]?: (props: { subject: Extract<TSubject, Record<TKey, TCase>> }) => unknown;
}>();
</script>

<template>
    <SwitchCase :value="subject[by]">
        <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name" :subject="subject" />
        </template>
    </SwitchCase>
</template>
