<script setup lang="ts">
import type { FlowGraphData } from '@generated/types/scripts';
import { VueFlow, type Edge, type Node } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import { computed } from 'vue';

/**
 * The read-only flowchart of a compiled script, placed by the rank and order the journal gives each node, with the
 * same graph as Mermaid text to copy. Choosing a node selects its source line; nothing runs.
 */
const props = defineProps<{ flowchart: FlowGraphData }>();

const emit = defineEmits<{ selectLine: [line: number] }>();

const nodes = computed<Node[]>(() =>
    props.flowchart.nodes.map((node) => ({
        id: node.id,
        position: { x: node.order * 220, y: node.rank * 90 },
        data: { label: node.line === null ? node.label : `${node.line}: ${node.label}` },
        class: `script-node script-node-${node.type}`,
    })),
);

function chooseNode(id: string): void {
    const line = props.flowchart.nodes.find((node) => node.id === id)?.line;

    if (line !== undefined && line !== null) {
        emit('selectLine', line);
    }
}

const edges = computed<Edge[]>(() =>
    props.flowchart.edges.map((edge, index) => ({
        id: `${edge.from}-${edge.port}-${index}`,
        source: edge.from,
        target: edge.to,
        label: edge.port,
    })),
);
</script>

<template>
    <section class="flex flex-col gap-2">
        <div class="h-96 rounded border border-border">
            <VueFlow
                :nodes="nodes"
                :edges="edges"
                :nodes-draggable="false"
                :nodes-connectable="false"
                :elements-selectable="false"
                fit-view-on-init
                @node-click="(event) => chooseNode(event.node.id)"
            />
        </div>
        <details>
            <summary class="cursor-pointer text-sm text-muted-foreground">Mermaid</summary>
            <pre class="overflow-x-auto rounded bg-muted p-2 text-xs">{{ flowchart.mermaid }}</pre>
        </details>
    </section>
</template>
