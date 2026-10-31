import {ref, watch} from "vue";
import {api} from "../api/client.js";
import {isPicture, isText, textOf} from "../format/files.js";

// What a file is, to draw it by its kind: a picture by its name, text when it is given or its bytes read as text, else other.
export function useFileContent(file, client = api) {
    const content = ref({kind: "loading", text: ""});
    let asked = 0;

    async function read(url) {
        const mine = ++asked;
        content.value = {kind: "loading", text: ""};
        try {
            const bytes = await client.fileBytes(url);
            if (mine === asked) content.value = isText(bytes) ? {kind: "text", text: textOf(bytes)} : {kind: "other", text: ""};
        } catch (e) {
            if (mine === asked) content.value = {kind: "failed", text: e.message};
        }
    }

    function take({name, url, text}) {
        asked++;
        if (isPicture(name)) return (content.value = {kind: "picture", text: ""});
        if (text !== null) return (content.value = {kind: "text", text});
        read(url);
    }

    watch(file, take, {immediate: true});
    return content;
}
