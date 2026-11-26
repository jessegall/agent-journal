<script setup lang="ts">
import DataSection from './partials/DataSection.vue';

import type { RequestWindowData } from '@generated/types/processes';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import ReviewRequestForm from './partials/ReviewRequestForm.vue';
import RuleActions from './partials/RuleActions.vue';

/**
 * One command request for its owner, a native part of the request's layout page: where it stands and the steps it still requires, every proposal revision with its effects
 * against the active rule, the samples with their runs, the readers with their proofs, and the review actions.
 */
const data = defineProps<RequestWindowData>();

const page = usePage<{ errors: Record<string, string> }>();
const refusal = computed(() => page.props.errors.review ?? '');
</script>

<template>
    <div class="flex flex-col gap-4">
        <p>
            Sorting a command into kinds does not allow it to run, and a sample
            run only shows what the command does.
        </p>
        <template v-if="refusal !== ''">
            <p role="alert">{{ refusal }}</p>
        </template>
        <DataSection :data="data" />
        <template v-if="data.activeRuleId !== null">
            <RuleActions :data="data" :rule-id="data.activeRuleId" />
        </template>
        <template v-for="proposal in data.proposals" :key="proposal.id">
            <section :aria-label="`Proposal ${proposal.id}`">
                <h2>
                    Proposal by {{ proposal.author }}: {{ proposal.state }},
                    revision {{ proposal.currentRevision }}
                </h2>
                <template
                    v-for="revision in proposal.revisions"
                    :key="revision.revision"
                >
                    <article :aria-label="`Revision ${revision.revision}`">
                        <h3>
                            Revision {{ revision.revision }}:
                            {{ revision.operation }} ({{ revision.owner }})
                        </h3>
                        <p>
                            Other ways to write it:
                            {{ revision.spellings.join(', ') || 'none' }}
                        </p>
                        <p>
                            Used for {{ revision.purpose }}; its output is
                            {{ revision.outputRequirement }}
                        </p>
                        <p>
                            Effects:
                            {{ revision.classes.join(', ') || 'none declared' }}
                        </p>
                        <p>
                            New compared with the rule in use:
                            {{ revision.addedClasses.join(', ') || 'none' }}
                        </p>
                        <p>
                            Dropped compared with the rule in use:
                            {{ revision.removedClasses.join(', ') || 'none' }}
                        </p>
                        <p>Executable: {{ revision.binding }}</p>
                        <p>
                            Replaces:
                            {{ revision.replaces.join(', ') || 'nothing' }}
                        </p>
                        <template v-if="revision.contract.length > 0">
                            <ul aria-label="Contract">
                                <template
                                    v-for="line in revision.contract"
                                    :key="line"
                                >
                                    <li>{{ line }}</li>
                                </template>
                            </ul>
                        </template>
                        <ul aria-label="Examples">
                            <template
                                v-for="example in revision.examples"
                                :key="example"
                            >
                                <li>{{ example }}</li>
                            </template>
                        </ul>
                        <p>Evidence: {{ revision.evidence }}</p>
                        <template v-if="revision.missingFields.length > 0">
                            <p>
                                Not filled in yet:
                                {{ revision.missingFields.join(', ') }}
                            </p>
                        </template>
                    </article>
                </template>
                <ReviewRequestForm
                    :data="data"
                    :proposal="proposal"
                    :digest="data.lineDigest"
                />
            </section>
        </template>
        <section aria-label="Samples">
            <h2>Samples</h2>
            <template v-if="data.samples.length === 0">
                <p class="text-text-3">No samples</p>
            </template>
            <template v-for="sample in data.samples" :key="sample.permitId">
                <article>
                    <p>
                        <code>{{ sample.line }}</code> as
                        {{ sample.approvedClasses.join(', ') }}
                    </p>
                    <p>
                        Stops after {{ sample.byteCap }} bytes or
                        {{ sample.secondsCap }} seconds
                    </p>
                    <template v-if="sample.runId === ''">
                        <p>Not run yet.</p>
                    </template>
                    <template v-else>
                        <p>
                            Run {{ sample.runId }}:
                            {{ sample.parts.join('; ') }}
                        </p>
                    </template>
                </article>
            </template>
            <template v-if="data.unsampledStatuses.length > 0">
                <p>
                    Exit codes not seen in a sample yet:
                    {{ data.unsampledStatuses.join(', ') }}
                </p>
            </template>
        </section>
        <section aria-label="Readers and proofs">
            <h2>Readers</h2>
            <template
                v-for="reader in data.readers"
                :key="reader.readerRevisionId"
            >
                <p>
                    Reader {{ reader.readerRevisionId }} for revision
                    {{ reader.declarationRevision }}:
                    {{
                        reader.proofs.length === 0
                            ? 'not checked yet'
                            : reader.proofs.join('; ')
                    }}
                </p>
            </template>
        </section>
    </div>
</template>
