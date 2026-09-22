import {computed, reactive, ref, watch, watchEffect} from "vue";
import {api} from "../api/client.js";
import {sectionChanges} from "../domain/diff.js";
import {age} from "../format/time.js";
import {useNow} from "./now.js";

const WINDOW = 8;

export function useRevisions(resource) {
    const numbers = computed(() => Array.from({length: Number(resource().data.revisions || 0)}, (_, i) => i + 1));
    const at = ref(-1);
    const pages = reactive({});
    const changes = ref(false);
    const error = ref("");
    const now = useNow(15000);

    watch(
        numbers,
        (latest, before) => {
            if (at.value < 0 || !before || at.value >= before.length - 1) at.value = latest.length - 1;
        },
        {immediate: true}
    );

    const loading = new Set();

    async function load(k) {
        if (!k || pages[k] || loading.has(k)) return;
        loading.add(k);
        try {
            pages[k] = await api.revision(resource().n, k);
        } catch (e) {
            error.value = e.message;
        } finally {
            loading.delete(k);
        }
    }

    watch(
        () => resource().updated,
        () => delete pages[numbers.value[numbers.value.length - 1]]
    );
    watchEffect(() => {
        load(numbers.value[at.value]);
        load(numbers.value[at.value - 1]);
    });

    const open = computed(() => Number(resource().data.open_until || 0) > now.value);
    const minutesLeft = computed(() => Math.max(1, Math.ceil((Number(resource().data.open_until || 0) - now.value) / 60)));
    const latest = computed(() => at.value === numbers.value.length - 1);
    const page = computed(() => pages[numbers.value[at.value]] || null);
    const previous = computed(() => (at.value > 0 ? pages[numbers.value[at.value - 1]] || null : null));
    const comparing = computed(() => changes.value && at.value > 0 && !!previous.value);
    const parts = computed(() =>
        comparing.value
            ? sectionChanges(previous.value.sections, page.value.sections)
            : (page.value?.sections || []).map((s) => ({...s, kind: "same", lines: []}))
    );
    const topChanged = computed(() =>
        comparing.value
            ? {
                  title: previous.value.title !== page.value.title,
                  abstract: previous.value.abstract !== page.value.abstract,
                  brief: previous.value.brief !== page.value.brief,
              }
            : {}
    );
    const status = computed(() => (latest.value && open.value ? `Open for edits, kept by itself in ${minutesLeft.value} min` : ""));
    const note = computed(() =>
        [
            status.value,
            page.value?.data.change,
            page.value?.seen.join(", "),
            page.value ? age(page.value.updated || page.value.created) || "just now" : "",
        ]
            .filter(Boolean)
            .join(" · ")
    );
    const ticks = computed(() => {
        const from = Math.max(0, Math.min(at.value - WINDOW + 2, numbers.value.length - WINDOW));
        return {from, revision: Array.from({length: Math.min(WINDOW, numbers.value.length)}, (_, k) => from + k)};
    });

    const go = (i) => (at.value = Math.max(0, Math.min(numbers.value.length - 1, i)));

    async function keep() {
        error.value = "";
        try {
            await api.act("doc", resource().n, "keep");
        } catch (e) {
            error.value = e.message;
        }
    }

    return reactive({numbers, at, changes, error, open, latest, comparing, page, parts, topChanged, status, note, ticks, go, keep});
}
