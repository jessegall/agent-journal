import {shallowRef} from "vue";
import {pageRoute} from "./pageRoute.js";

// the page the address asks for, followed through the back button, so moving to another page redraws it and never reloads
export const shownPage = shallowRef(pageRoute(location.search));

export function moveToPage(address) {
    history.pushState(null, "", address);
    shownPage.value = pageRoute(location.search);
}

window.addEventListener("popstate", () => (shownPage.value = pageRoute(location.search)));
