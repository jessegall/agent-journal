<script setup lang="ts">
import { computed } from 'vue';
import Reader from '@kit/Reader';
import type { RuleReaderData } from '@generated/types/rules';
import ReviewRuleForm from './ReviewRuleForm.vue';
import { ruleStateLook } from './ruleLooks';

/**
 * The selected rule, or why there is none: nothing chosen, or a choice that does not exist.
 */
const props = defineProps<{
    reader?: RuleReaderData;
    selectionMissing: boolean;
}>();

const title = computed(() =>
    props.reader === undefined ? '' : `Rule ${props.reader.id}`,
);
</script>

<template>
    <template v-if="reader">
        <Reader :title="title">
            <template #meta>
                <span :class="ruleStateLook[reader.state].tone">{{
                    ruleStateLook[reader.state].label
                }}</span>
            </template>
            <template #actions>
                <template v-if="reader.canReview">
                    <ReviewRuleForm :key="reader.id" :rule-number="reader.number" />
                </template>
            </template>
            <p class="mt-4 text-body whitespace-pre-wrap text-text">
                {{ reader.text }}
            </p>
        </Reader>
    </template>
    <template v-else-if="selectionMissing">
        <p class="p-6 text-empty text-text-3">This rule does not exist.</p>
    </template>
    <template v-else>
        <p class="p-6 text-empty text-text-3">Choose a rule to read it.</p>
    </template>
</template>
