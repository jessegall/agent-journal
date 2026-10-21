import {computed, reactive, ref, watch} from "vue";
import {api} from "../api/client.js";
import {sectionChanges} from "../domain/diff.js";
import {madeBy, sectionsOf, seconds} from "../domain/row.js";
import {ago} from "../format/time.js";
import {useNow} from "./now.js";

const WINDOW = 8;
const AUTHORS = {user: "you", agent: "the agent"};
const intro = (body) => (body || "").split(/^## +/m)[0].trim();

// A document's revisions as the strip above it reads them: which one is shown, whether the newest is open for edits, and what changed since the one before.
export function useDocRevisions(resource, client = api) {
    const revisions = ref([]);
    const at = ref(-1);
    const changes = ref(false);
    const error = ref("");
    const now = useNow(15000);

    async function load() {
        try {
            const got = await client.docRevisions(resource().id);
            const following = at.value < 0 || at.value >= revisions.value.length - 1;
            revisions.value = got;
            if (following) at.value = got.length - 1;
        } catch (e) {
            error.value = e.message;
        }
    }

    watch(() => [resource().id, resource().updated_at], load, {immediate: true});

    const count = computed(() => revisions.value.length);
    const newest = computed(() => revisions.value[count.value - 1] || null);
    const open = computed(() => Boolean(newest.value) && newest.value.closes_at > now.value);
    const minutesLeft = computed(() => Math.max(1, Math.ceil(((newest.value?.closes_at || 0) - now.value) / 60)));
    const latest = computed(() => at.value === count.value - 1);
    const page = computed(() => revisions.value[at.value] || null);
    const previous = computed(() => (at.value > 0 ? revisions.value[at.value - 1] : null));
    const comparing = computed(() => changes.value && Boolean(previous.value));
    const parts = computed(() =>
        comparing.value
            ? sectionChanges(sectionsOf(previous.value.body), sectionsOf(page.value.body))
            : sectionsOf(page.value?.body).map((s) => ({...s, kind: "same", lines: []}))
    );
    const topChanged = computed(() =>
        comparing.value
            ? {
                  title: previous.value.title !== page.value.title,
                  abstract: previous.value.abstract !== page.value.abstract,
                  intro: intro(previous.value.body) !== intro(page.value.body),
              }
            : {}
    );
    const status = computed(() => (latest.value && open.value ? `Being edited - kept as one revision in ${minutesLeft.value} min` : ""));
    const note = computed(() =>
        [
            status.value,
            page.value?.change,
            page.value ? AUTHORS[madeBy(page.value)] || madeBy(page.value) : "",
            page.value ? ago(seconds(page.value.updated_at)) || "just now" : "",
        ]
            .filter(Boolean)
            .join(" · ")
    );
    const hidden = computed(() => Math.max(0, Math.min(at.value - WINDOW + 2, count.value - WINDOW)));
    const indexes = computed(() => Array.from({length: Math.min(WINDOW, count.value)}, (_, k) => hidden.value + k));
    const go = (i) => (at.value = Math.max(0, Math.min(count.value - 1, i)));

    async function keep() {
        error.value = "";
        try {
            await client.keepDoc(resource().id);
            await load();
        } catch (e) {
            error.value = e.message;
        }
    }

    return reactive({
        count,
        hidden,
        indexes,
        at,
        changes,
        error,
        open,
        latest,
        comparing,
        page,
        parts,
        topChanged,
        status,
        note,
        intro,
        go,
        keep,
    });
}
