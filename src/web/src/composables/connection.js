import {ref} from "vue";
import {api} from "../api/client.js";

export const connection = ref(null);

export async function loadConnection(address = "") {
    connection.value = await api.connection(address).catch(() => null);
    return connection.value;
}

export async function connectToServer(address) {
    await api.connectTo(address.trim());
    return loadConnection();
}

export async function disconnectFromServer() {
    await api.disconnectFromServer();
    return loadConnection();
}
