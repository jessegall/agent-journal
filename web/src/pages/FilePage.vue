<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import {highlight, languageOf} from "../text/highlight.js";
import Icon from "../kit/Icon.vue";
import Btn from "../kit/Btn.vue";
import Highlight from "../resource/Highlight.vue";
import {sendMessage} from "../chat/outbox.js";
import {route} from "../route.js";

const file = ref(null);
const error = ref("");
const matches = computed(() => (file.value && file.value.matches) || []);
const lines = computed(() => (file.value && !matches.value.length ? highlight(file.value.text, languageOf(file.value.path)) : []));

async function load() {
    error.value = "";
    file.value = null;
    try {
        file.value = await api.projectFile(route.value.q);
    } catch (e) {
        error.value = e.message;
    }
}
const picked = ref(null);
const words = ref("");
const sent = ref(false);
const lineOf = (node) =>
    Number(((node.nodeType === 1 ? node : node.parentElement).closest("[data-line]") || {dataset: {}}).dataset.line || 0);

function pick(text, range) {
    const first = range ? lineOf(range.startContainer) : 0;
    const last = range ? lineOf(range.endContainer) || first : first;
    picked.value = {text, first, last};
    words.value = "";
    sent.value = false;
}

async function send() {
    const {text, first, last} = picked.value;
    const where = first ? (first === last ? `line ${first}` : `lines ${first}-${last}`) : "a selection";
    const source = first
        ? file.value.text
              .split("\n")
              .slice(first - 1, last)
              .join("\n")
        : text;
    const quoted = source
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    await sendMessage(route.value.env, {brief: `About ${file.value.path}, ${where}:\n\n${quoted}\n\n${words.value.trim()}`});
    picked.value = null;
    sent.value = true;
}

onMounted(load);
watch(() => route.value.q, load);
</script>

<template>
    <section class="filepage">
        <template v-if="error">
            <p class="empty">{{ error }}</p>
        </template>
        <template v-if="matches.length">
            <p class="empty">{{ matches.length }} files in the project are named {{ route.q }}:</p>
            <ul class="matches">
                <template v-for="path in matches" :key="path">
                    <li>
                        <a :href="`#/${route.env}/file?q=${encodeURIComponent(path)}`">
                            <Icon name="file" />
                            <code>{{ path }}</code>
                        </a>
                    </li>
                </template>
            </ul>
        </template>
        <template v-else-if="file">
            <header class="head">
                <Icon name="file" />
                <code class="path">{{ file.path }}</code>
                <span class="when">{{ file.lines ? `${file.lines} lines · ` : "" }}{{ file.size }} bytes</span>
            </header>
            <template v-if="file.kind.startsWith('image/')">
                <p class="empty">An image; open it from Files if it is an attachment.</p>
            </template>
            <template v-else>
                <template v-if="picked">
                    <div class="ask">
                        <p class="lines">
                            {{
                                picked.first
                                    ? picked.first === picked.last
                                        ? `Line ${picked.first}`
                                        : `Lines ${picked.first}-${picked.last}`
                                    : "Selection"
                            }}
                            of {{ file.path }}
                        </p>
                        <textarea v-model="words" rows="3" placeholder="Your comment, sent to the agent" autofocus />
                        <div class="actions">
                            <Btn small @click="picked = null">Cancel</Btn>
                            <Btn kind="primary" small :disabled="!words.trim()" @click="send">Send to the agent</Btn>
                        </div>
                    </div>
                </template>
                <template v-if="sent">
                    <p class="sent">Sent to the agent; the file itself is unchanged.</p>
                </template>
                <Highlight @quote="pick">
                    <pre
                        class="text"
                    ><template v-for="(line, i) in lines" :key="i"><span class="line" :data-line="i + 1"><span class="n">{{ i + 1 }}</span><span v-html="line" /></span>
</template></pre>
                </Highlight>
            </template>
        </template>
    </section>
</template>

<style scoped>
.filepage {
    max-width: 1080px;
    padding: 22px 28px 60px;
}

.ask {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.lines,
.sent {
    margin: 0;
    color: var(--text-2);
    font-size: 12.5px;
}

.ask textarea {
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    font-size: 13px;
    resize: vertical;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.empty {
    color: var(--text-3);
}

.head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
}

.head .ico {
    width: 15px;
    height: 15px;
    color: var(--text-3);
}

.path {
    padding: 1px 6px;
    border-radius: 4px;
    background: var(--raised);
    font-size: 12.5px;
    color: var(--accent-text);
}

.when {
    font-size: 12px;
    color: var(--text-3);
}

.text {
    margin: 14px 0 0;
    padding: 12px 14px;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
    line-height: 1.5;
    color: var(--text-2);
}

.n {
    display: inline-block;
    width: 3.5em;
    margin-right: 10px;
    text-align: right;
    color: var(--text-4);
    user-select: none;
}
.matches {
    margin: 0;
    padding: 0;
    list-style: none;
}

.matches a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 4px;
    color: var(--text-2);
    text-decoration: none;
}

.matches a:hover {
    color: var(--accent-text);
}
</style>
