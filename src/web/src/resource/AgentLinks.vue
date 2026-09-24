<script setup>
import LinkCard from "../kit/LinkCard.vue";
import {kindOf, useAgentLinks} from "../composables/agentLinks.js";

const props = defineProps({agent: {type: Number, required: true}, session: {type: String, default: ""}});
const links = useAgentLinks(() => [props.agent, props.session]);
</script>

<template>
    <template v-if="links.length">
        <div class="agent-links">
            <template v-for="href in links.slice(0, 3)" :key="href">
                <LinkCard :href="href" :kind="kindOf(href)" />
            </template>
        </div>
    </template>
</template>

<style scoped>
.agent-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>
