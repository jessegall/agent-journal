<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Data\Pages\DeclarationData;
use App\Data\Pages\RequestWindowData;
use App\Data\Processes\ReaderProofData;
use App\Data\Processes\RequestRowData;
use App\Data\Processes\SampleData;
use App\Data\Profiles\ProposalData;
use App\Http\Requests\Processes\RequestPageRequest;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleProposalRevision;
use App\Models\Runs\PartRun;
use App\Models\Runs\ReaderProof;
use App\Models\Runs\ReaderRevision;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Values\CommandClassSet;
use App\Values\CommandRule;
use App\Values\ProvenBranch;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One command request of the current project with everything an approval binds; a request of another project is not
 * found.
 */
final readonly class RequestWindowResolver implements PageResolver
{
    public function __construct(private RequestPageRequest $page) {}

    public function read(): DeclaredLayoutData
    {
        $request = CommandRequest::query()
            ->whereKey($this->page->requestId())
            ->firstOr(fn () => throw new NotFoundHttpException());

        $proposals = RuleProposal::query()->ofCommandRequest($request->id)->limit(20)->get();
        $latest = null;
        $latestProposal = $proposals->first();

        if ($latestProposal !== null) {
            $latestRevision = $latestProposal->revisions()->newestRevisionFirst()->first();
            $latest = $latestRevision?->payload;
        }

        $active = $this->activeRule($request, $latest);

        $detail = RequestWindowData::from([
            'request' => RequestRowData::fromRequest($request),
            'steps' => $request->nextStep->steps,
            'proposals' => array_values(
                $proposals->map(fn (RuleProposal $proposal) => $this->proposalOf($proposal, $active))->all(),
            ),
            'samples' => $this->samplesOf($request),
            'readers' => $this->readersOf($request),
            'unsampledStatuses' => $this->unsampledOf($request, $latest),
            'activeRuleId' => $active?->id,
            'activeRevision' => $active === null ? 0 : $active->active_revision,
            'lineDigest' => $request->source_digest,
        ]);

        return DeclaredLayoutData::of(LayoutPartData::box(
            'request',
            'stack',
            LayoutPartData::box(
                'header',
                'header',
                LayoutPartData::text('title', "Request: {$request->operation}", 'heading'),
            ),
            LayoutPartData::native('detail', LayoutNativeData::of('processes/RequestWindow', $detail)),
        ));
    }

    private function activeRule(CommandRequest $request, CommandRule|null $declared): ClassificationRule|null
    {
        if ($declared === null) {
            return null;
        }

        return ClassificationRule::query()
            ->inProject($request->project_id)
            ->ofRule($declared->scope, $declared->id)
            ->withActiveRevision()
            ->first();
    }

    private function proposalOf(RuleProposal $proposal, ClassificationRule|null $active): ProposalData
    {
        $classes = $active === null ? CommandClassSet::none() : $active->activeRevision->payload->classes;
        $revisions = $proposal->revisions()->newestRevisionFirst()->limit(20)->get();

        return ProposalData::from([
            'id' => $proposal->id,
            'state' => $proposal->status->value,
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
        $permits = EvidencePermit::query()->ofCommandRequest($request->id)->limit(20)->get();

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
        return array_values(PartRun::query()->ofProcessRun($runId)->limit(50)->get()->map(
            fn (PartRun $part) => "{$part->operation}: {$part->lifecycle->value}, end {$part->end_type->value}"
                .($part->end->hasStatus() ? " {$part->end_code}" : '').", capture {$part->capture_state->value}",
        )->all());
    }

    /**
     * @return list<ReaderProofData>
     */
    private function readersOf(CommandRequest $request): array
    {
        $readers = ReaderRevision::query()->ofCommandRequest($request->id)->limit(20)->get();

        return array_values($readers->map(fn (ReaderRevision $reader) => new ReaderProofData(
            $reader->id,
            $reader->declaration_revision,
            array_values(ReaderProof::query()->ofReaderRevision($reader->id)->limit(10)->get()->map(
                fn (ReaderProof $proof) => "{$proof->id}: ".implode(', ', array_map(
                    fn (ProvenBranch $branch) => "exit {$branch->status} {$branch->outcome->value}",
                    $proof->proven_branches->items(),
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
