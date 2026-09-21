import {createApp} from "vue";
import App from "./App.vue";
import {watchConsole} from "./faults.js";
import "./tokens.css";

watchConsole();
createApp(App).mount("#app");
