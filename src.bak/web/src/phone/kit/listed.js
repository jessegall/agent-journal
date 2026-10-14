import {api} from "../../api/client.js";
import {PAGE} from "../../sync/paging.js";

export const newestFirst =
    (type) =>
    async ({before}) => {
        const got = await api.list(type, {last: PAGE, before});
        return {rows: [...got.rows].reverse(), more: got.more};
    };
