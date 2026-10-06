<template>
    <span class="pick-tag"><slot /></span>
</template>

<style scoped>
.pick-tag {
    background: color-mix(in srgb, var(--tone, var(--accent)) 22%, var(--raised));
    color: color-mix(in srgb, var(--tone, var(--accent)) 60%, var(--text));
    font-size: 11px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}
</style>
