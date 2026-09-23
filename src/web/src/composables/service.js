import {ref} from "vue";
import {api} from "../api/client.js";
import {usePoll} from "../poll.js";

const LOG_EVERY = 2000;

export function useServiceAction(after = () => {}) {
    const error = ref("");
    const acting = ref(null);
    const working = (id) => Boolean(acting.value) && acting.value.id === id;
    const busy = (id, want) => working(id) && acting.value.want === want;

    async function set(id, want) {
        if (working(id)) return;
        acting.value = {id, want};
        try {
            await api.setService(id, want);
            error.value = "";
        } catch (e) {
            error.value = e.message;
        }
        await after();
        acting.value = null;
    }

    return {error, set, busy, working};
}

export function useServiceLog() {
    const reading = ref("");
    const log = ref("");
    const poke = usePoll(
        "service-log",
        () => (reading.value ? api.serviceLog(reading.value) : Promise.resolve(null)),
        LOG_EVERY,
        (got) => got && (log.value = got.log)
    );

    function read(id) {
        reading.value = reading.value === id ? "" : id;
        log.value = "";
        poke();
    }

    return {reading, log, read};
}
