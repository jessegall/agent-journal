<?php

declare(strict_types=1);

namespace App\Processes\Readers;

use App\Http\Requests\Processes\RequestPageRequest;
use App\Processes\Data\DeclarationData;
use App\Processes\Data\ProposalData;
use App\Processes\Data\ReaderProofData;
use App\Processes\Data\RequestRowData;
use App\Processes\Data\RequestWindowData;
use App\Processes\Data\SampleData;
use App\Processes\Models\ClassificationRule;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\EvidencePermit;
use App\Processes\Models\PartRun;
use App\Processes\Models\ReaderProof;
use App\Processes\Models\ReaderRevision;
use App\Processes\Models\RuleProposal;
use App\Processes\Models\RuleProposalRevision;
use App\Processes\Support\ProjectKey;
use App\Processes\Values\CommandClassSet;
use App\Processes\Values\CommandRule;
use App\Processes\Values\ProvenBranch;
use App\Ui\Contracts\PageReader;

/**
 * One command request of the current project with everything an approval binds; a request of another project is not
 * found.
 */
final readonly class RequestWindowReader implements PageReader
{
    public function __construct(private RequestPageRequest $page, private ProjectKey $projects) {}

    public function read(): RequestWindowData
    {
        $request = CommandRequest::query()
            ->ofProject($this->projects->current())
            ->whereKey($this->page->requestId())
            ->firstOrFail();
        $proposals = RuleProposal::query()->where('command_request_id', $request->id)->readLimit(20)->get();
        $latest = $proposals->first()?->revisions()->orderByDesc('revision')->first()?->payload;
        $active = $this->activeRule($request, $latest);

        return new RequestWindowData(
            RequestRowData::fromRequest($request),
            $request->nextStep()->obligations,
            $proposals->map(fn (RuleProposal $proposal): ProposalData => $this->proposalOf($proposal, $active))->all(),
            $this->samplesOf($request),
            $this->readersOf($request),
            $this->unsampledOf($request, $latest),
            $active === null ? 0 : $active->active_revision,
            $request->source_digest,
        );
    }

    private function activeRule(CommandRequest $request, CommandRule|null $declared): ClassificationRule|null
    {
        if ($declared === null) {
            return null;
        }

        return ClassificationRule::query()
            ->ofProject($request->project_key)
            ->ofRule($declared->scope, $declared->id)
            ->with('activeRevision')
            ->first();
    }

    private function proposalOf(RuleProposal $proposal, ClassificationRule|null $active): ProposalData
    {
        $classes = $active === null ? CommandClassSet::empty() : $active->activeRevision->payload->classes;
        $revisions = $proposal->revisions()->orderByDesc('revision')->readLimit(20)->get();

        return new ProposalData(
            $proposal->id,
            $proposal->state->value,
            $proposal->current_revision,
            "{$proposal->author_type}:{$proposal->author_id}",
            $revisions->map(
                fn (RuleProposalRevision $revision): DeclarationData => DeclarationData::fromRevision($revision, $classes),
            )->all(),
        );
    }

    /**
     * @return list<SampleData>
     */
    private function samplesOf(CommandRequest $request): array
    {
        $permits = EvidencePermit::query()->where('command_request_id', $request->id)->readLimit(20)->get();

        return $permits->map(fn (EvidencePermit $permit): SampleData => new SampleData(
            $permit->id,
            $permit->source_line,
            $permit->approved_classes,
            $permit->byte_cap,
            $permit->seconds_cap,
            (string) $permit->process_run_id,
            $permit->process_run_id === null ? [] : $this->partsOf($permit->process_run_id),
        ))->values()->all();
    }

    /**
     * @return list<string>
     */
    private function partsOf(string $runId): array
    {
        return PartRun::query()->where('process_run_id', $runId)->readLimit(50)->get()->map(
            fn (PartRun $part): string => "{$part->operation}: {$part->lifecycle->value}, end {$part->end_type->value}"
                .($part->end()->hasStatus() ? " {$part->end_code}" : '').", capture {$part->capture_state->value}",
        )->all();
    }

    /**
     * @return list<ReaderProofData>
     */
    private function readersOf(CommandRequest $request): array
    {
        $readers = ReaderRevision::query()->where('command_request_id', $request->id)->readLimit(20)->get();

        return $readers->map(fn (ReaderRevision $reader): ReaderProofData => new ReaderProofData(
            $reader->id,
            $reader->declaration_revision,
            ReaderProof::query()->where('reader_revision_id', $reader->id)->readLimit(10)->get()->map(
                fn (ReaderProof $proof): string => "{$proof->id}: ".implode(', ', array_map(
                    fn (ProvenBranch $branch): string => "exit {$branch->status} {$branch->outcome->value}",
                    $proof->proven_branches,
                )),
            )->all(),
        ))->all();
    }

    /**
     * @return list<int>
     */
    private function unsampledOf(CommandRequest $request, CommandRule|null $declared): array
    {
        $contracts = $declared === null ? [] : $declared->contracts;
        $statuses = [];
        foreach ($contracts as $contract) {
            foreach ($request->unsampledBranches($contract->exits) as $branch) {
                $statuses[] = $branch->status;
            }
        }

        return $statuses;
    }
}
