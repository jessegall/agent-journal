<script setup>
import CloseButton from "../kit/CloseButton.vue";
import ResourceBody from "../resource/ResourceBody.vue";

defineProps({resource: {type: Object, required: true}});
const emit = defineEmits(["close"]);
</script>

<template>
    <div class="fill scroll">
        <ResourceBody :resource="resource" read-only>
            <template #tools>
                <CloseButton title="Back to the list" @click="emit('close')" />
            </template>
        </ResourceBody>
    </div>
</template>
