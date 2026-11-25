<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\CommandRules\ProposeReader\ProposeReaderCommand;
use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Commands\CommandRules\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Commands\CommandRules\SettleSample\SettleSampleCommand;
use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Work\StackTransactionRunner;
use App\Declarations\VerificationContract;
use App\Enums\CommandRules\EvidenceSource;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\Processes\OutputStream;
use App\Exceptions\ShippedReaderUnmatched;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\Rules\ShippedReaders;
use App\Values\CapturedChunk;
use App\Values\CommandRule;
use App\Values\EvidenceRange;
use App\Values\OwnerApproval;
use App\Values\PartKey;
use App\Values\ProgressPolicy;
use App\Values\ProofSample;
use App\Values\ProposedRule;
use App\Values\ReaderApproval;
use App\Values\ReaderReference;
use App\Values\RuleExample;
use App\Values\RuleReference;
use App\Values\RuleScope;
use App\Values\ShippedReader;
use App\Values\ToolVersions;
use Carbon\CarbonImmutable;

/**
 * Approves the readers Core ships for the project's installed tools: for each tool whose installed version is the one
 * a shipped reader was proven on, it walks the owner's own workflow (request, rule with its contract, reader, the
 * stored samples as sample runs, proof, approval), so the check is admitted like any other approved one. A tool at
 * another version, or one the project already approved a reader for, is left alone.
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
    ) {}

    /**
     * The tools installed, by the shipped readers that matched them.
     *
     * @return list<string>
     */
    public function install(ToolVersions $installed, string $folder): array
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
        $approval = new OwnerApproval(1, 0, [new ReaderApproval($readerId, $proofId)], 'Core ships this reader.');
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

        $rule = CommandRule::from([
            ...$core->toArray(),
            'contracts' => [$contract->toArray()],
        ]);

        return $rule->ownedBy(RuleScope::project(), 1)
            ->replacing(new RuleReference(RuleScope::core(), $core->id, $core->revision));
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

        $run = ProcessRun::ofAnyActor($runId);
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
