<script setup lang="ts">
import Button from '@kit/Button';
import type {
    BundleListPartData,
    BundleRowData,
} from '@generated/types/processes';
import { router, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

/**
 * The module rule bundles waiting for activation, as a native part of the review list: each at its exact digest, with
 * its rules, activated with its own idempotency key; a refused activation shows above them.
 */
defineProps<BundleListPartData>();

const page = usePage<{ errors: Record<string, string> }>();
const refusal = computed(() => page.props.errors.review ?? '');

function approveBundle(bundle: BundleRowData): void {
    router.post(
        '/processes/bundles/approval',
        {
            module: bundle.module,
            version: bundle.version,
            digest: bundle.digest,
        },
        {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            preserveScroll: true,
        },
    );
}
</script>

<template>
    <section class="flex flex-col gap-2" aria-label="Module bundles waiting">
        <h2 class="text-heading">Module bundles waiting</h2>
        <template v-if="refusal !== ''">
            <p role="alert">{{ refusal }}</p>
        </template>
        <template v-if="bundles.length === 0">
            <p class="text-text-3">No module bundle is waiting.</p>
        </template>
        <template v-else>
            <ul class="flex flex-col gap-1">
                <template
                    v-for="bundle in bundles"
                    :key="`${bundle.module}@${bundle.digest}`"
                >
                    <li class="flex flex-wrap items-center gap-2">
                        <span
                            >{{ bundle.module }} {{ bundle.version }} ({{
                                bundle.digest.slice(0, 12)
                            }}):</span
                        >
                        <span>{{ bundle.rules.join(', ') }}</span>
                        <Button variant="bordered" @click="approveBundle(bundle)">
                            Activate this bundle
                        </Button>
                    </li>
                </template>
            </ul>
        </template>
    </section>
</template>
