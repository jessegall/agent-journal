<script setup>
import {copyText} from "../platform/clipboard.js";
import {computed, inject, onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import {announce, tell} from "./announce.js";
import {ended} from "./outbox.js";
import Button from "./kit/Button.vue";
import PhoneSheet from "./PhoneSheet.vue";
import PhoneShareLinks from "./PhoneShareLinks.vue";
import PhoneShareRow from "./PhoneShareRow.vue";

const props = defineProps({target: {type: String, required: true}, title: {type: String, required: true}});
const emit = defineEmits(["close"]);
const failed = inject("phoneFailed");
const file = ref(null);
const fileFailed = ref("");
const link = ref("");
const busy = ref("");
const told = ref("");
const canShare = typeof navigator.share === "function";
const filesShare = computed(() => Boolean(file.value) && Boolean(navigator.canShare?.({files: [file.value]})));
const exportUrl = phone.exportUrl(props.target);

onMounted(async () => {
    try {
        file.value = await phone.exported(props.target, `${props.title}.html`);
    } catch (error) {
        if (ended(error)) failed(error);
        else fileFailed.value = "The document could not be made right now.";
    }
});

function missed(error, what) {
    if (error?.name === "AbortError") return false;
    tell(told, `${what} didn't go through: ${error?.message || "unknown reason"}.`);
    return false;
}

async function shareLink(url, close) {
    try {
        await navigator.share({title: props.title, url});
        announce("Link shared");
        close();
    } catch (error) {
        if (error?.name === "NotAllowedError") return;
        missed(error, "Sharing the link");
    }
}

async function copyLink(url, close) {
    if (!(await copyText(url))) return announce("The link could not be copied");
    announce("Link copied");
    close();
}

async function makeLink(close) {
    busy.value = "link";
    told.value = "";
    try {
        link.value = (await phone.share(props.target)).link;
        if (canShare) await shareLink(link.value, close);
        else await copyLink(link.value, close);
    } catch (error) {
        if (ended(error)) failed(error);
        else missed(error, "Making the link");
    } finally {
        busy.value = "";
    }
}

async function sendDocument(close) {
    told.value = "";
    try {
        await navigator.share({files: [file.value], title: props.title});
        announce("Document shared");
        close();
    } catch (error) {
        missed(error, "Sending the document");
    }
}
</script>

<template>
    <PhoneSheet v-slot="{close}" label="Share" @close="emit('close')">
        <h2 class="share-title">Share “{{ title }}”</h2>
        <ul class="share-list">
            <li>
                <template v-if="link && canShare">
                    <PhoneShareRow icon="share" name="Share link" note="The link is ready" @press="shareLink(link, close)" />
                </template>
                <template v-else>
                    <PhoneShareRow
                        icon="webpage"
                        name="Share a link"
                        note="Anyone with the link can read it"
                        :busy="busy === 'link'"
                        @press="makeLink(close)"
                    />
                </template>
            </li>
            <li>
                <template v-if="filesShare">
                    <PhoneShareRow icon="docs" name="Send as a document" :note="file.name" @press="sendDocument(close)" />
                </template>
                <template v-else-if="file || fileFailed">
                    <PhoneShareRow
                        icon="download"
                        name="Download the document"
                        :note="fileFailed || file.name"
                        :href="exportUrl"
                        :download="file ? file.name : ''"
                    />
                </template>
                <template v-else>
                    <PhoneShareRow icon="docs" name="Send as a document" note="Preparing the document…" waiting />
                </template>
            </li>
        </ul>
        <PhoneShareLinks :target="target" />
        <template v-if="told">
            <p class="share-told">{{ told }}</p>
        </template>
        <Button kind="plain" fill @click="close">Cancel</Button>
    </PhoneSheet>
</template>

<style scoped>
.share-title {
    margin: 4px 0 12px;
    overflow: hidden;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.share-list {
    margin: 0 0 12px;
    padding: 0;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
    list-style: none;
}

.share-list li + li {
    border-top: 1px solid var(--line);
}

.share-told {
    margin: 0 0 12px;
    color: var(--text-2);
}
</style>
