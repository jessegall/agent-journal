<script setup lang="ts">
import { visitLink } from "../../dockLinks";
import Button from "@kit/Button";
import type { ButtonNode } from "@kit/dockCards";

/**
 * A button its owner declared: it opens a page, which checks the viewer's access as it opens.
 */
const props = defineProps<{ node: ButtonNode }>();

const variants = {
  primary: "primary",
  secondary: "bordered",
  quiet: "word",
} as const satisfies Record<ButtonNode["emphasis"], string>;

function press(): void {
  visitLink(props.node.target);
}
</script>

<template>
  <Button
    class="w-fit"
    :variant="variants[node.emphasis]"
    size="small"
    @click="press"
    >{{ node.label }}</Button
  >
</template>
