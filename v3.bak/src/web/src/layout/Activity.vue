<script setup>
import ActivityEvents from "./ActivityEvents.vue";
</script>

<template>
    <aside class="activity-dock">
        <div class="activity-panel">
            <div class="activity-head">
                <span class="activity-tab on">Activity</span>
            </div>
            <ActivityEvents />
        </div>
    </aside>
</template>

<style scoped>
.activity-dock {
    width: 290px;
    flex: none;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 10px;
    background: var(--side);
    border-left: 1px solid var(--border);
}

.activity-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.activity-head {
    height: 48px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    margin: 0 -10px;
    padding: 0 18px;
    border-bottom: 1px solid var(--border);
}

.activity-tab {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    color: var(--text-3);
    white-space: nowrap;
    cursor: pointer;
}

.activity-tab:hover {
    color: var(--text-2);
}

.activity-tab.on {
    color: var(--text);
    box-shadow: inset 0 -1px 0 var(--accent);
}
</style>
