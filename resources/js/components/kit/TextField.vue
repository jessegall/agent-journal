<script setup lang="ts">
import FormField from "@/components/kit/FormField.vue";
import { computed } from "vue";

/**
 * A labelled one-line text field. A code field shows what a user types from another screen, such as a sign-in
 * code, in a fixed-width face, and is never filled in by the browser or kept by it. A secret field, such as an API
 * key, hides what is typed and is never filled in or kept either. The end slot sits inside the field at its right
 * end, such as a Save that shows only for a changed value. A read-only field shows a value to select and copy.
 */
const props = withDefaults(
  defineProps<{
    id: string;
    label: string;
    error?: string;
    hint?: string;
    maxlength?: number;
    code?: boolean;
    secret?: boolean;
    autocomplete?: string;
    disabled?: boolean;
    readonly?: boolean;
  }>(),
  {
    error: undefined,
    hint: undefined,
    maxlength: undefined,
    code: false,
    secret: false,
    autocomplete: "off",
    disabled: false,
    readonly: false,
  },
);

const value = defineModel<string>({ required: true });

/**
 * What the browser may fill in: nothing it keeps for a code or a secret, else what the field asks for.
 */
const autocompleteValue = computed(() => {
  if (props.code) {
    return "one-time-code";
  }

  return props.secret ? "new-password" : props.autocomplete;
});
</script>

<template>
  <FormField :id="id" :label="label" :error="error" :hint="hint">
    <template #default="field">
      <div class="relative flex">
        <input
          :id="field.id"
          v-model="value"
          :type="secret ? 'password' : 'text'"
          :maxlength="maxlength"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocompleteValue"
          :spellcheck="code ? false : undefined"
          :aria-invalid="field.invalid"
          :aria-describedby="field.describedBy"
          class="h-7 min-w-0 flex-1 rounded-control border border-border-2 bg-transparent px-2.5 text-field text-text transition-colors duration-(--duration-hover) placeholder:text-text-4 focus-visible:border-brand focus-visible:outline-none disabled:opacity-45 aria-invalid:border-danger"
          :class="{
            'font-mono tracking-[0.2em] uppercase': code,
            'pr-20': $slots.end,
          }"
        />
        <template v-if="$slots.end">
          <span class="absolute inset-y-0 right-1 flex items-center">
            <slot name="end" />
          </span>
        </template>
      </div>
    </template>
  </FormField>
</template>
