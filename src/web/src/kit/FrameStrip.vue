<script setup>
defineProps({url: {type: String, required: true}, count: {type: Number, default: 0}, current: {type: Number, default: 0}, size: {type: Number, default: 56}});
defineEmits(["pick"]);
</script>

<template>
    <div class="frame-strip" role="listbox" aria-label="Frames">
        <template v-for="index in count" :key="index">
            <button
                type="button"
                role="option"
                :aria-selected="index - 1 === current"
                :class="['frame-strip-frame', {current: index - 1 === current}]"
                :title="`Frame ${index}`"
                :style="{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundImage: `url(${url})`,
                    backgroundSize: `${size * count}px ${size}px`,
                    backgroundPosition: `${-(index - 1) * size}px 0`,
                }"
                @click="$emit('pick', index - 1)"
            >
                <span class="frame-strip-number">{{ index }}</span>
            </button>
        </template>
    </div>
</template>

<style scoped>
.frame-strip {
    display: flex;
    gap: 6px;
    padding: 4px 2px 8px;
    overflow-x: auto;
}

.frame-strip-frame {
    position: relative;
    flex: none;
    border: 1px solid var(--border);
    border-radius: 6px;
    background-color: color-mix(in srgb, var(--text) 4%, transparent);
    background-repeat: no-repeat;
    cursor: pointer;
}

.frame-strip-frame.current {
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
}

.frame-strip-number {
    position: absolute;
    right: 3px;
    bottom: 1px;
    color: var(--text-3);
    font-size: 10px;
}
</style>
