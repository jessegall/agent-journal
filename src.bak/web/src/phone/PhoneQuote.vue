<script setup>
defineProps({
    quoted: {type: String, default: ""},
    about: {type: String, default: ""},
    aboutLabel: {type: String, default: ""},
    inlineQuote: {type: String, default: ""},
});
</script>

<template>
    <template v-if="quoted">
        <a class="turn-quote" href="#" :data-peek="about" :aria-label="`Reply to: ${quoted}`">
            <span class="quote-text">{{ quoted }}</span>
        </a>
    </template>
    <template v-else-if="about">
        <a class="turn-about" href="#" :data-peek="about" :aria-label="`About ${aboutLabel}`">{{ aboutLabel }}</a>
    </template>
    <template v-if="inlineQuote && !quoted">
        <p class="turn-quote">
            <span class="phone-hidden">Reply to:</span>
            {{ inlineQuote }}
        </p>
    </template>
</template>

<style scoped>
.turn-quote {
    display: -webkit-box;
    margin: 0 0 6px;
    padding: 4px 10px;
    overflow: hidden;
    border-left: 3px solid var(--accent);
    border-radius: 4px;
    background: color-mix(in oklab, var(--bg) 40%, transparent);
    color: var(--text-2);
    font-size: 0.824rem;
    line-height: 1.3;
    text-decoration: none;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

a.turn-quote {
    display: block;
}

.quote-text {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.turn-about {
    display: inline-block;
    margin-bottom: 6px;
    padding: 1px 8px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    color: var(--accent-text);
    font-size: 0.706rem;
    text-decoration: none;
}
</style>
