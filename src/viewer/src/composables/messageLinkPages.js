import {computed, onScopeDispose, ref, shallowRef, watch} from "vue";

const windows = new WeakMap();
const WORK = "work";
const SENT = "sent";
const VISIBLE_PAGE = 50;
const RECEIPTS_AT_MOST = 50;
const pageState = () => ({rows: ref([]), total: ref(0), next: ref(null), loading: ref(false), failure: ref(""), version: 0});

function pagesFor(context) {
    if (windows.has(context)) return windows.get(context);
    const entries = new Map();
    const pending = new Set();
    let timer = null;
    const visible = (state) => context.visible?.value !== false && [...state.views].some((view) => view.visible);

    function start(state, kind) {
        const current = state[kind];
        const version = ++current.version;
        current.loading.value = true;
        current.failure.value = "";
        return version;
    }

    // shows what a read answered for one kind of one message, unless the message went or a newer read of the kind began
    function show(state, kind, version, page, answer) {
        const current = state[kind];
        if (entries.get(state.id) !== state || current.version !== version) return;
        current.loading.value = false;
        if (!answer.ok) {
            current.failure.value = answer.error;
            return;
        }
        const rows = kind === WORK ? answer.value.counterparts ?? [] : answer.value.rows ?? [];
        const combined = page === 1 ? rows : [...current.rows.value, ...rows];
        const key = kind === WORK ? (row) => `${row.endpoint.model}:${row.endpoint.id}` : (row) => row.id ?? row.target_id;
        current.rows.value = [...new Map(combined.map((row) => [key(row), row])).values()];
        current.total.value = answer.value.total ?? current.rows.value.length;
        current.next.value = answer.value.next_page ?? null;
    }

    function fail(state, kind, version, error) {
        const current = state[kind];
        if (current.version !== version) return;
        current.failure.value = error.message;
        current.loading.value = false;
    }

    // a page behind the first of one message
    async function read(state, kind, page) {
        const version = start(state, kind);
        const types = kind === WORK ? "--type about --type edited --group-counterparts" : "--type sent_to";
        try {
            show(state, kind, version, page, await context.read(`link list --source message:${state.id} ${types} --page ${page} --page-size ${kind === WORK ? 10 : 25}`));
        } catch (error) {
            fail(state, kind, version, error);
        }
    }

    // the first page of what several messages name and of the agents they also went to, in one request
    async function readFirstPages(states) {
        const versions = states.map((state) => ({[WORK]: start(state, WORK), [SENT]: start(state, SENT)}));
        try {
            const answer = await context.read(`link receipts --messages ${states.map((state) => state.id).join(",")}`);
            states.forEach((state, at) => {
                const receipt = answer.ok ? answer.value.messages[String(state.id)] : null;
                show(state, WORK, versions[at][WORK], 1, answer.ok ? {ok: true, value: receipt.named} : answer);
                show(state, SENT, versions[at][SENT], 1, answer.ok ? {ok: true, value: receipt.sent} : answer);
            });
        } catch (error) {
            states.forEach((state, at) => [WORK, SENT].forEach((kind) => fail(state, kind, versions[at][kind], error)));
        }
    }

    function flush() {
        timer = null;
        const states = [...pending].map((id) => entries.get(id)).filter((state) => state && visible(state));
        pending.clear();
        states.forEach((state) => state.dirty.clear());
        for (let first = 0; first < states.length; first += RECEIPTS_AT_MOST) readFirstPages(states.slice(first, first + RECEIPTS_AT_MOST));
    }

    function queue(state, categories = [WORK, SENT]) {
        for (const kind of categories) state.dirty.add(kind);
        if (!visible(state)) return;
        pending.add(state.id);
        timer ??= setTimeout(flush, 0);
    }

    function invalidate(event) {
        const sources = event.sources ?? (event.source_model && Number.isInteger(event.source_id) ? [{model: event.source_model, id: event.source_id}] : []);
        const types = event.link_types ?? (event.link_type ? [event.link_type] : []);
        const categories = types.length ? [WORK, SENT].filter((kind) => kind === WORK ? types.some((type) => ["about", "edited"].includes(type)) : types.includes("sent_to")) : [WORK, SENT];
        if (!categories.length) return;
        const states = sources.length
            ? [...new Set(sources.filter((source) => source.model === "message").map((source) => source.id))].map((id) => entries.get(id)).filter(Boolean)
            : [...entries.values()].filter(visible).slice(0, VISIBLE_PAGE);
        for (const state of states) queue(state, categories);
    }

    const stop = context.follow?.(["link.*"], invalidate);
    const pages = {
        attach(id, view) {
            let state = entries.get(id);
            if (!state) {
                state = {id, views: new Set(), dirty: new Set([WORK, SENT]), work: pageState(), sent: pageState()};
                entries.set(id, state);
            }
            state.views.add(view);
            if (state.dirty.size) queue(state, [...state.dirty]);
            return state;
        },
        shown(state) {
            if (state.dirty.size) queue(state, [...state.dirty]);
        },
        detach(state, view) {
            state.views.delete(view);
            if (!state.views.size) entries.delete(state.id);
            if (!entries.size) {
                clearTimeout(timer);
                stop?.();
                windows.delete(context);
            }
        },
        more(state, kind) {
            const page = state?.[kind];
            if (page?.next.value && !page.loading.value) return read(state, kind, page.next.value);
        },
    };
    windows.set(context, pages);
    return pages;
}

export function useMessageLinkPages(context, messageId, element) {
    const current = shallowRef(null);
    let pages = null;
    const stop = watch(messageId, (id, previous, cleanup) => {
        if (!context?.read || !Number.isInteger(id) || id < 1) return;
        pages = pagesFor(context);
        const view = {visible: typeof IntersectionObserver === "undefined"};
        const state = pages.attach(id, view);
        current.value = state;
        const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
            view.visible = entries.some((entry) => entry.isIntersecting);
            if (view.visible) pages.shown(state);
        }, {rootMargin: "100px"});
        const stopElement = watch(element, (node) => {
            observer?.disconnect();
            if (node) observer?.observe(node);
        }, {immediate: true, flush: "post"});
        cleanup(() => {
            stopElement();
            observer?.disconnect();
            pages.detach(state, view);
            current.value = null;
        });
    }, {immediate: true});
    onScopeDispose(stop);
    return {
        links: computed(() => current.value?.work.rows.value ?? []),
        total: computed(() => current.value?.work.total.value ?? 0),
        more: computed(() => Boolean(current.value?.work.next.value)),
        loading: computed(() => current.value?.work.loading.value ?? false),
        failure: computed(() => current.value?.work.failure.value ?? ""),
        sentTo: computed(() => (current.value?.sent.rows.value ?? []).map((row) => row.target)),
        sentMore: computed(() => Boolean(current.value?.sent.next.value)),
        sentLoading: computed(() => current.value?.sent.loading.value ?? false),
        sentFailure: computed(() => current.value?.sent.failure.value ?? ""),
        loadMore: () => pages?.more(current.value, WORK),
        loadSent: () => pages?.more(current.value, SENT),
    };
}
