<?php

declare(strict_types=1);

namespace App\CommandRules;

use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\CommandRules\Commands\ApproveSample\ApproveSampleCommand;
use App\CommandRules\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\CommandRules\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\CommandRules\Commands\ProposeReader\ProposeReaderCommand;
use App\CommandRules\Commands\ProveReader\ProveReaderCommand;
use App\CommandRules\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\CommandRules\Commands\SettleSample\SettleSampleCommand;
use App\CommandRules\Commands\StartSample\StartSampleCommand;
use App\CommandRules\Enums\EvidenceSource;
use App\CommandRules\Enums\RequestHoldReason;
use App\CommandRules\Exceptions\ShippedReaderUnmatched;
use App\CommandRules\Rules\ShippedReaders;
use App\CommandRules\Values\OwnerApproval;
use App\CommandRules\Values\ProposedRule;
use App\CommandRules\Values\ReaderApproval;
use App\CommandRules\Values\RuleExample;
use App\CommandRules\Values\RuleReference;
use App\CommandRules\Values\RuleScope;
use App\CommandRules\Values\ShippedReader;
use App\CommandRules\Values\ToolVersions;
use App\Contracts\Work\StackTransactionRunner;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Models\Projects\Project;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Processes\Declarations\VerificationContract;
use App\Processes\Enums\OutputStream;
use App\Processes\OutputRecorder;
use App\Processes\OutputSummaries;
use App\Processes\Values\PartKey;
use App\Processes\Values\ProofSample;
use App\Projects\CurrentProject;
use App\Values\CapturedChunk;
use App\Values\CommandRule;
use App\Values\EvidenceRange;
use App\Values\ProgressPolicy;
use App\Values\ProjectSelection;
use App\Values\ReaderReference;
use Carbon\CarbonImmutable;

/**
 * Approves the readers Core ships for the project's installed tools: for each tool at the version a reader was proven
 * on, it walks the owner's workflow from request to approval with the stored samples. A tool at another version, or one
 * with an approved reader already, is left alone.
 */
final readonly class ShippedReaderInstaller
{
    public function __construct(
        private ShippedReaders $readers,
        private CommandRuleRegistry $coreRules,
        private CommandBus $commands,
        private StackTransactionRunner $transaction,
        private OutputRecorder $recorder,
        private OutputSummaries $summaries,
        private ActiveRules $rules,
        private CurrentProject $projects,
    ) {}

    /**
     * The tools installed, by the shipped readers that matched them, approved into the project alone.
     *
     * @return list<string>
     */
    public function install(ToolVersions $installed, string $folder, Project $project): array
    {
        return $this->projects->within(
            ProjectSelection::of($project->id),
            fn () => $this->installMatching($installed, $folder),
        );
    }

    /**
     * @return list<string>
     */
    private function installMatching(ToolVersions $installed, string $folder): array
    {
        $done = [];

        foreach ($this->readers->all() as $reader) {
            $matches = $installed->hasInstalled($reader->versionSource, $reader->version);

            if ($matches && $this->rules->approvedFor($this->coreRule($reader)->operation()) === []) {
                $this->approve($reader, $folder);
                $done[] = $reader->tool;
            }
        }

        return $done;
    }

    private function approve(ShippedReader $reader, string $folder): void
    {
        $core = $this->coreRule($reader);

        $requestId = $this->commands->run(new OpenCommandRequestCommand(
            $reader->invocation,
            hash('sha256', $reader->invocation),
            $reader->invocation,
            $folder,
            RequestHoldReason::ReaderRequired,
        ));

        $proposed = new ProposedRule(
            $this->replacingRule($reader, $core),
            "Core ships a reader proven on {$reader->tool} {$reader->version} ({$reader->versionSource}).",
            [RuleExample::positive($reader->invocation, $core->classes)],
        );

        $draftKey = "shipped-{$reader->tool}-{$reader->version}";
        $this->commands->run(new ProposeCommandRuleCommand($requestId, $draftKey, $proposed));
        $runs = [];

        foreach ($reader->samples() as $sample) {
            if ($sample->provesABranch()) {
                $runs[] = $this->recordSample($requestId, $reader, $sample);
            }
        }

        $readerId = $this->commands->run(new ProposeReaderCommand($requestId, 1, $reader->reader));
        $proofId = $this->commands->run(new ProveReaderCommand($requestId, $readerId, $runs));

        $approval = new OwnerApproval(1, 0, [ReaderApproval::from([
            'reader_revision_id' => $readerId,
            'proof_id' => $proofId,
        ])], 'Core ships this reader.');

        $proposal = RuleProposal::query()->ofCommandRequest($requestId)->sole();
        $this->commands->run(new ApproveRuleProposalCommand($proposal->id, $approval));
    }

    private function coreRule(ShippedReader $reader): CommandRule
    {
        $rules = array_filter(
            $this->coreRules->declaredRules(),
            fn (CommandRule $rule) => $rule->id === $reader->operation,
        );

        return array_values($rules)[0] ?? throw ShippedReaderUnmatched::forRule($reader->operation);
    }

    /**
     * The core rule with the shipped contract, as a project rule that replaces it.
     */
    private function replacingRule(ShippedReader $reader, CommandRule $core): CommandRule
    {
        $contract = new VerificationContract(
            $core->operation(),
            $core->contracts[0]->tool,
            $core->binding,
            $reader->contract,
            $reader->exits,
            ProgressPolicy::indeterminate(),
            ReaderReference::required(),
        );

        return $core->verifiedBy($contract)
            ->ownedBy(RuleScope::project(), 1)
            ->replacing(RuleReference::from([
                'scope' => RuleScope::core(),
                'id' => $core->id,
                'revision' => $core->revision,
            ]));
    }

    /**
     * One stored sample recorded as an owner-approved sample run of the request, and the request settled after it.
     */
    private function recordSample(string $requestId, ShippedReader $reader, ProofSample $sample): string
    {
        $request = CommandRequest::query()->findOrFail($requestId);
        $permit = $this->commands->run(new ApproveSampleCommand($requestId, 1, $request->source_digest));

        $runId = $this->commands->run(
            new StartSampleCommand($requestId, $permit, "shipped-{$reader->tool}-{$sample->file}"),
        );

        $run = ProcessRun::findForAnyActor($runId);
        $bytes = $reader->outputOf($sample);

        $part = $this->transaction->run(function () use ($run, $reader, $sample, $bytes): PartRun {
            $part = PartRun::create($run, new PartKey(1, 1, $reader->invocation));
            $part->start('shipped');
            $this->recorder->append(new CapturedChunk($part, OutputStream::Stdout, $bytes, CarbonImmutable::now()));
            $part->finishProcess($sample->end());
            $part->finishDraining();
            $this->recorder->finish($part, $sample->end());

            return $part;
        });

        $this->summaries->of($run);
        $read = EvidenceRange::bytes($part->id, EvidenceSource::of(OutputStream::Stdout), 0, strlen($bytes));
        $this->commands->run(new RecordEvidenceReadsCommand($run->id, [$read]));
        $this->commands->run(new SettleSampleCommand($requestId));

        return $runId;
    }
}
