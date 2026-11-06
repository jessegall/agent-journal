import {reactive} from "vue";
import {useWindow} from "@journal/window-kit";
import {EVERYONE, MAIN, OTHERS, countLine} from "./memoryScope.js";

// how many active memories the choices of whose to read hold: the main agent, every other agent, and all, each read as a page of one row
export function useCounts(environment) {
    const context = useWindow();
    const counts = reactive({main: 0, others: 0, everyone: 0});

    const totalOf = async (who) => {
        const answer = await context.read(countLine(who, environment));
        return answer.ok ? answer.value.total : 0;
    };

    async function load() {
        [counts.main, counts.others, counts.everyone] = await Promise.all([totalOf(MAIN), totalOf(OTHERS), totalOf(EVERYONE)]);
    }

    context.follow(["memory.*"], () => load());
    load();
    return counts;
}
