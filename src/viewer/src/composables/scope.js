import {inject} from "vue";
import {api} from "../api/client.js";
import {earlier, hasLoaded, holding, keepRows, readComments, releaseRows, rows} from "../sync/rows.js";
const HERE = {env: "", api, rows, loaded: hasLoaded, holding, earlier, keepRows, releaseRows, readComments};

export const useScope = () => inject("scope", HERE);

