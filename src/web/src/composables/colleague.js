import {computed} from "vue";
import {colleagueOwner, personName} from "../domain/people.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {rows} from "../sync/rows.js";

// The colleague whose environment is open, by name, and the viewer's own name; no colleague in the viewer's own environment.
export function useColleague() {
    const environment = computed(() => rows("environments").find((row) => row.name === route.value.env));
    const colleague = computed(() => {
        const owner = environment.value ? colleagueOwner(environment.value.id, store.people) : 0;
        return owner ? personName(owner, store.people) : "";
    });
    const me = computed(() => personName(store.people.me, store.people));
    return {colleague, me};
}
