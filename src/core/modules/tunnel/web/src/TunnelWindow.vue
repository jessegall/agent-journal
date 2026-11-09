<script setup>
import {Skeleton, WindowRoom, useWindow} from "@journal/window-kit";

// whether phones and share links can reach this viewer from outside: the tunnel's state, its address, and justification not
const WORDS = {connected: "Connected", disconnected: "Not connected", reconnecting: "Reconnecting"};
const view = useWindow();
const {data: status, failure} = view.props.status;
</script>

<template>
    <WindowRoom>
        <div class="tunnel" data-tunnel>
            <template v-if="failure">
                <p class="tunnel-failure" role="alert">{{ failure }}</p>
            </template>
            <template v-else-if="!status">
                <Skeleton shape="text" />
            </template>
            <template v-else>
                <p class="tunnel-state" :data-state="status.state">{{ WORDS[status.state] ?? status.state }}</p>
                <template v-if="status.address">
                    <p class="tunnel-address" data-tunnel-address>{{ status.address }}</p>
                </template>
                <template v-if="status.reason">
                    <p class="tunnel-reason" data-tunnel-reason>{{ status.reason }}</p>
                </template>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.tunnel {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.tunnel-state {
    margin: 0;
    font-weight: 500;
}

.tunnel-address {
    margin: 0;
    color: var(--text-2);
    overflow-wrap: anywhere;
}

.tunnel-reason {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.tunnel-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
