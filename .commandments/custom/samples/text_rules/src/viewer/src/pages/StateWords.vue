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
    <!-- @sin naming_plain_viewer_state_text -->
    <span>{{ row.state === 'open' ? row.state : stateLabel('task', row.state) }}</span>
    <!-- @sin naming_plain_viewer_state_text -->
    <span>{{ row.state === 'open' ? stateLabel('task', row.state) : row.state }}</span>
    <!-- @sin naming_plain_viewer_state_text -->
    <span>{{ shown ? facts?.role : agentRoleLabel(facts.role) }}</span>
    <!-- @righteous naming_plain_viewer_state_text -->
    <span>{{ row.state === 'open' ? stateLabel('task', row.state) : stateLabel('task', row.state) }}</span>
    <!-- @righteous naming_plain_viewer_state_text -->
    <span>{{ row.state === other.state ? 'Same state' : 'Different state' }}</span>
</template>
