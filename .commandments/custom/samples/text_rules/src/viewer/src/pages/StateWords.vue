<template>
    <!-- @sin naming_plain_viewer_state_text -->
    <span>{{ row.state }}</span>
    <!-- @sin naming_plain_viewer_state_text -->
    <span>{{ facts.role }}</span>
    <!-- @sin naming_plain_viewer_state_text -->
    <span>{{ row?.state }}</span>
    <!-- @righteous naming_plain_viewer_state_text -->
    <span>{{ stateLabel('task', row.state) }}</span>
    <!-- @righteous naming_plain_viewer_state_text -->
    <span>{{ agentRoleLabel(facts.role) }}</span>
    <!-- @righteous naming_plain_viewer_state_text -->
    <span :class="row.state">{{ row.title }}</span>
    <!-- @righteous naming_plain_viewer_state_text -->
    <span>{{ row.state === 'open' ? 'Open' : 'Closed' }}</span>
</template>
