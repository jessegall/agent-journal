<script setup>
import Segmented from "../kit/Segmented.vue";
import Switch from "../kit/Switch.vue";
import TextInput from "../kit/TextInput.vue";

const EXPIRES = [
    {key: "1d", label: "1 day"},
    {key: "7d", label: "7 days"},
    {key: "30d", label: "30 days"},
    {key: "never", label: "Never"},
];
const expires = defineModel("expires", {type: String, default: "7d"});
const password = defineModel("password", {type: String, default: ""});
const comments = defineModel("comments", {type: Boolean, default: false});
</script>

<template>
    <div class="rows">
        <div class="row">
            <span class="label">Ends after</span>
            <Segmented :options="EXPIRES" :value="expires" @pick="(key) => (expires = key)" />
        </div>
        <div class="row">
            <span class="label">Password</span>
            <TextInput
                class="password"
                type="password"
                autocomplete="new-password"
                :value="password"
                placeholder="None"
                aria-label="Password"
                @input="password = $event.target.value"
            />
        </div>
        <template v-if="password">
            <p class="quiet hint">Visitors enter any name and this password.</p>
        </template>
        <div class="row">
            <span class="label">Visitors can comment</span>
            <Switch :on="comments" title="Let visitors comment under a name of their own" @change="comments = $event" />
        </div>
    </div>
</template>

<style scoped>
.rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 14px;
    border-top: 1px solid var(--border);
}

.row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 6px 12px;
    min-height: 30px;
}

.row .password {
    flex: 0 1 200px;
    min-width: 0;
}

.hint {
    margin-top: -4px;
    text-align: right;
}

.label {
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.password {
    max-width: 280px;
}

.quiet,
.meta {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
