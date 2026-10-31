<script setup>
import {computed} from "vue";

// The buttons the agent put under its message: one opens a web address in a new tab, one posts a form with its hidden fields.
const props = defineProps({message: {type: Object, required: true}});
const buttons = computed(() => props.message.data?.buttons || []);
const isForm = (button) => button.method === "POST";
</script>

<template>
    <div class="message-buttons">
        <template v-for="(button, i) in buttons" :key="i">
            <template v-if="isForm(button)">
                <form class="message-button-form" method="post" :action="button.action" target="_blank" rel="noopener">
                    <template v-for="(value, name) in button.fields" :key="name">
                        <input type="hidden" :name="name" :value="value" />
                    </template>
                    <button type="submit" class="message-button" v-tip="button.note">{{ button.label }}</button>
                </form>
            </template>
            <template v-else>
                <a class="message-button" :href="button.action" target="_blank" rel="noopener noreferrer" v-tip="button.note">{{ button.label }}</a>
            </template>
        </template>
    </div>
</template>

<style scoped>
.message-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
}

.message-button-form {
    display: contents;
}

.message-button {
    display: inline-flex;
    align-items: center;
    height: 28px;
    padding: 0 12px;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    text-decoration: none;
    cursor: pointer;
}

.message-button:hover {
    border-color: var(--border-2);
    background: var(--hover);
}
</style>
