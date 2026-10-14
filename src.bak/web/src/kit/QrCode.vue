<script setup>
import {computed} from "vue";
import qrcode from "qrcode-generator";

const props = defineProps({text: {type: String, required: true}, size: {type: Number, default: 200}});

const cells = computed(() => {
    const code = qrcode(0, "M");
    code.addData(props.text);
    code.make();
    const count = code.getModuleCount();
    const dark = [];
    for (let row = 0; row < count; row += 1) {
        for (let col = 0; col < count; col += 1) {
            if (code.isDark(row, col)) dark.push(`M${col + 4} ${row + 4}h1v1h-1z`);
        }
    }
    return {count: count + 8, path: dark.join("")};
});
</script>

<template>
    <svg class="qr" :width="size" :height="size" :viewBox="`0 0 ${cells.count} ${cells.count}`" shape-rendering="crispEdges" role="img" aria-label="QR code">
        <rect :width="cells.count" :height="cells.count" fill="#fff" />
        <path :d="cells.path" fill="#000" />
    </svg>
</template>

<style scoped>
.qr {
    display: block;
    border-radius: 10px;
}
</style>
