<script setup>
import {computed} from "vue";
import {Btn, ListTools, QrCode, RowList, WindowRoom, removed, useListTools, useWindow} from "@journal/window-kit";

const ABILITIES = ["Read the chat and see what needs you", "Answer questions", "Read reports, documents, plans and tasks", "Approve a plan or ask for changes", "Send the agent instructions"];

const view = useWindow();
const {rows, failure, loaded, act, actionFailure, answer} = view.props.phones;
const {data: tunnel} = view.props.tunnel;
const paired = computed(() => rows.value.filter((row) => row.state === "paired"));
const tools = useListTools(paired, {title: (row) => row.name});
</script>

<template>
    <WindowRoom>
        <div class="phones">
            <template v-if="tunnel?.state === 'disconnected'">
                <p class="phones-failure" data-phone-tunnel>A phone can't reach this journal yet: {{ tunnel.reason }}</p>
            </template>
            <div class="phones-pair">
                <Btn variant="primary" @click="act(['phone', 'pair'])">Pair a phone</Btn>
                <template v-if="answer">
                    <p class="phones-code">Code: {{ answer.code }}</p>
                    <template v-if="answer.link">
                        <div data-phone-qr><QrCode :text="answer.link" /></div>
                    </template>
                    <p class="phones-hint">Open {{ answer.link }} on the phone, or type the code on its pairing page. The code works once, for ten minutes.</p>
                </template>
                <template v-if="actionFailure">
                    <p class="phones-failure">{{ actionFailure }}</p>
                </template>
                <ul class="phones-abilities" data-phone-abilities>
                    <template v-for="ability in ABILITIES" :key="ability">
                        <li>{{ ability }}</li>
                    </template>
                </ul>
            </div>
            <ListTools :tools="tools" />
            <RowList :rows="tools.shown.value" :failure="failure" :loaded="loaded" empty="No phone is paired" hint="Paired phones appear here." :searching="tools.filtering.value">
                <template #default="{row}">
                    <span class="phones-name">{{ row.name }}</span>
                    <Btn small @click="act(['phone', 'unpair', String(row.id)], removed(row.id))">Unpair</Btn>
                </template>
            </RowList>
        </div>
    </WindowRoom>
</template>

<style scoped>
.phones {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.phones-pair {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.phones-code {
    margin: 0;
    font-size: 18px;
    letter-spacing: 0.08em;
}

.phones-hint,
.phones-failure {
    margin: 0;
    color: var(--text-2);
}

.phones-abilities {
    margin: 0;
    padding-left: 18px;
    color: var(--text-3);
    font-size: 12.5px;
}

.phones-name {
    flex: 1;
}
</style>
