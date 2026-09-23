<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import ChatLine from "../kit/ChatLine.vue";
import ChatPanel from "../kit/ChatPanel.vue";
import FocusStage from "../kit/FocusStage.vue";
import TemplateCard from "./TemplateCard.vue";
import {TEMPLATES, boardBody, guess, withReview} from "./templates.js";

const props = defineProps({open: Boolean, first: Boolean});
const emit = defineEmits(["close", "made"]);
const templates = ref(TEMPLATES);
const chosen = ref("");
const words = ref("");
const lines = ref([]);
const making = ref(false);
const panel = ref(null);
const template = computed(() => templates.value.find((t) => t.key === chosen.value));
const greeting = computed(() =>
    props.first
        ? "There's no ticket board yet. Shall I start one from a template? Pick one, or tell me what it's for."
        : "Pick a template for the new board, or tell me what it's for."
);

watch(
    () => props.open,
    (open) => open && panel.value.focus()
);

const say = (mine, text) => (lines.value = [...lines.value, {id: lines.value.length, mine, text}]);
const review = (key) => (templates.value = templates.value.map((t) => (t.key === key ? withReview(t) : t)));

function choose(key, why) {
    chosen.value = key;
    const name = key === "blank" ? "" : template.value.title;
    words.value = name;
    say(
        false,
        `${why || `${template.value.title} it is.`} ${name ? `I'll call it ${name}; change the name or press Enter.` : "What should I call it?"}`
    );
    panel.value.focus();
}

function send(text) {
    say(true, text);
    words.value = "";
    if (template.value) return make(text);
    const found = guess(text);
    if (!found) return say(false, "None of these fit. Pick Blank and rename its stages after, or pick another.");
    choose(found.key, `That sounds like ${found.title}: ${found.stages.map(([stage]) => stage).join(", ")}.`);
}

async function make(title) {
    making.value = true;
    const made = await api.create("board", boardBody(template.value, title));
    making.value = false;
    chosen.value = "";
    lines.value = [];
    templates.value = TEMPLATES;
    emit("made", made.n);
}
</script>

<template>
    <FocusStage :open="open" leave="Not now" @close="emit('close')">
        <div class="templates">
            <template v-for="t in templates" :key="t.key">
                <TemplateCard
                    :template="t"
                    :chosen="chosen === t.key"
                    :dimmed="Boolean(chosen) && chosen !== t.key"
                    @choose="choose(t.key)"
                    @review="review(t.key)"
                />
            </template>
        </div>
        <ChatPanel
            ref="panel"
            v-model="words"
            :grows="lines.length"
            :locked="making"
            :action="template ? 'Make it' : 'Send'"
            :placeholder="template ? 'Name the board' : 'Or tell me what the board is for'"
            @send="send"
        >
            <ChatLine :text="greeting" typed />
            <template v-for="line in lines" :key="line.id">
                <ChatLine :text="line.text" :mine="line.mine" :typed="!line.mine" />
            </template>
        </ChatPanel>
    </FocusStage>
</template>

<style scoped>
.templates {
    display: grid;
    flex: 1;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    align-content: end;
    gap: 12px;
    min-height: 0;
    overflow-y: auto;
}
</style>
