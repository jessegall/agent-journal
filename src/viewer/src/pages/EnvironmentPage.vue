<script setup>
import {onMounted, ref} from "vue";
import {shellReader} from "../windows/startup.js";

const props = defineProps({search: {type: String, default: ""}});
const names = ref(null);

// an address without an environment: the one environment there is is opened, with the rest of the address kept
onMounted(async () => {
    const answer = await shellReader("")(["environment", "list"]);
    const rows = answer.ok ? (answer.value?.rows ?? answer.value ?? []) : [];
    names.value = Array.isArray(rows) ? rows.map((row) => row.name).filter(Boolean) : [];
    if (names.value.length === 1) {
        const query = new URLSearchParams(props.search);
        query.set("environment", names.value[0]);
        location.replace(`?${query}`);
    }
});
</script>

<template>
    <div class="environment-page">
        <template v-if="names !== null && names.length !== 1">
            <p class="environment-page-text">This address names no environment. Add ?environment= and the name of the environment to open.</p>
            <template v-if="names.length">
                <p class="environment-page-text">Environments: {{ names.join(", ") }}</p>
            </template>
        </template>
    </div>
</template>

<style scoped>
.environment-page {
    padding: 24px;
    color: var(--text-2);
}

.environment-page-text {
    margin: 0 0 8px;
}
</style>
