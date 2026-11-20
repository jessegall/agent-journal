<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

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
use App\Ui\Contracts\PageResolver;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One command request of the current project with everything an approval binds; a request of another project is not
 * found.
 */
final readonly class RequestWindowResolver implements PageResolver
{
    public function __construct(private RequestPageRequest $page, private ProjectKey $projects) {}

    public function read(): RequestWindowData
    {
        $request = CommandRequest::query()
            ->ofProject($this->projects->current())
            ->whereKey($this->page->requestId())
            ->firstOr(fn () => throw new NotFoundHttpException());
        $proposals = RuleProposal::query()->where('command_request_id', $request->id)->readLimit(20)->get();
        $latest = $proposals->first()?->revisions()->orderByDesc('revision')->first()?->payload;
        $active = $this->activeRule($request, $latest);

        return RequestWindowData::from([
            'request' => RequestRowData::fromRequest($request),
            'steps' => $request->nextStep()->steps,
            'proposals' => array_values(
                $proposals->map(fn (RuleProposal $proposal) => $this->proposalOf($proposal, $active))->all(),
            ),
            'samples' => $this->samplesOf($request),
            'readers' => $this->readersOf($request),
            'unsampledStatuses' => $this->unsampledOf($request, $latest),
            'activeRevision' => $active === null ? 0 : $active->active_revision,
            'lineDigest' => $request->source_digest,
        ]);
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

        return ProposalData::from([
            'id' => $proposal->id,
            'state' => $proposal->state->value,
            'currentRevision' => $proposal->current_revision,
            'author' => "{$proposal->author_type}:{$proposal->author_id}",
            'revisions' => array_values($revisions->map(
                fn (RuleProposalRevision $revision) => DeclarationData::fromRevision($revision, $classes),
            )->all()),
        ]);
    }

    /**
     * @return list<SampleData>
     */
    private function samplesOf(CommandRequest $request): array
    {
        $permits = EvidencePermit::query()->where('command_request_id', $request->id)->readLimit(20)->get();

        return array_values($permits->map(fn (EvidencePermit $permit) => SampleData::fromPermit(
            $permit,
            $permit->process_run_id === null ? [] : $this->partsOf($permit->process_run_id),
        ))->all());
    }

    /**
     * @return list<string>
     */
    private function partsOf(string $runId): array
    {
        return array_values(PartRun::query()->where('process_run_id', $runId)->readLimit(50)->get()->map(
            fn (PartRun $part): string => "{$part->operation}: {$part->lifecycle->value}, end {$part->end_type->value}"
                .($part->end()->hasStatus() ? " {$part->end_code}" : '').", capture {$part->capture_state->value}",
        )->all());
    }

    /**
     * @return list<ReaderProofData>
     */
    private function readersOf(CommandRequest $request): array
    {
        $readers = ReaderRevision::query()->where('command_request_id', $request->id)->readLimit(20)->get();

        return array_values($readers->map(fn (ReaderRevision $reader) => new ReaderProofData(
            $reader->id,
            $reader->declaration_revision,
            array_values(ReaderProof::query()->where('reader_revision_id', $reader->id)->readLimit(10)->get()->map(
                fn (ReaderProof $proof): string => "{$proof->id}: ".implode(', ', array_map(
                    fn (ProvenBranch $branch): string => "exit {$branch->status} {$branch->outcome->value}",
                    $proof->proven_branches,
                )),
            )->all()),
        ))->all());
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
