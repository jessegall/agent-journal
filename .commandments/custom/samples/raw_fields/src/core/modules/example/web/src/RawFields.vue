<script setup>
const label = (value) => value;
</script>

<template>
    <!-- @sin naming_plain_viewer_raw_field_text -->
    <p>{{ run.last_at }}</p>
    <!-- @sin naming_plain_viewer_raw_field_text -->
    <p>{{ share.row_model }} {{ share.row_id }}</p>
    <!-- @sin naming_plain_viewer_raw_field_text -->
    <p>{{ check.rule }}</p>
    <!-- @sin naming_plain_viewer_raw_field_text -->
    <p>{{ check.outcome }}</p>
    <!-- @righteous naming_plain_viewer_raw_field_text -->
    <p>{{ label(run.last_at) }}</p>
    <!-- @righteous naming_plain_viewer_raw_field_text -->
    <p>{{ share.row_id }}</p>
    <!-- @righteous naming_plain_viewer_raw_field_text -->
    <p>{{ check.reason }}</p>
</template>
