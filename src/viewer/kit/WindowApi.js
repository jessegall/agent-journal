import {useKeyRows} from "./useRows.js";
import {useWindowData} from "./useWindowData.js";

// the one way a window reads its data: it names its keys in its module, and asks here for them, for the rows of a key, or for a
// reload of some of them; `state` and `tab` are what the server's readers take, and nothing else in a window reads
export class WindowApi {
    constructor(options = {}) {
        this.data = useWindowData(options);
    }

    key(name) {
        return this.data.data[name];
    }

    rows(name, options = {}) {
        return useKeyRows(this.data, name, options);
    }

    reload(only = []) {
        return this.data.reload({only});
    }
}
