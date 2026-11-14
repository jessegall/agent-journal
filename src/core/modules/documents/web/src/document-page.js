import {h} from "vue";
import DocumentLibrary from "./DocumentLibrary.vue";

// the page: the documents in a sidebar and the chosen one read beside them
export default {render: () => h(DocumentLibrary, {reader: true})};
