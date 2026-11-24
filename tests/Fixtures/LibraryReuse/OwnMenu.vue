<script setup lang="ts">
// A component that draws its own button, menu and floating surface instead of the library's, for LibraryReuseTest.
</script>

<template>
    <div role="menu">
        <button type="button">Open</button>
        <textarea
            rows="2"
        />
        <div class="absolute top-full rounded-menu bg-raised shadow-pop">Floating</div>
    </div>
</template>
