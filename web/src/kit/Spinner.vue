<template>
    <span class="spinner" />
</template>

<style scoped>
.spinner {
    width: 9px;
    height: 9px;
    flex: none;
    border: 1px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
