<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Bus\Contracts\CommandBus;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Commands\ApproveSample;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Commands\ProposeReader;
use App\Processes\Commands\ProveReader;
use App\Processes\Commands\RecordEvidenceReads;
use App\Processes\Commands\SettleSample;
use App\Processes\Commands\StartSample;
use App\Processes\Declarations\VerificationContract;
use App\Processes\Enums\EvidenceSource;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Exceptions\ShippedReaderUnmatched;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RuleProposal;
use App\Processes\Rules\ShippedReaders;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\CommandRule;
use App\Processes\Values\EvidenceRange;
use App\Processes\Values\OwnerApproval;
use App\Processes\Values\PartKey;
use App\Processes\Values\ProgressPolicy;
use App\Processes\Values\ProofSample;
use App\Processes\Values\ProposedRule;
use App\Processes\Values\ReaderApproval;
use App\Processes\Values\ReaderReference;
use App\Processes\Values\RuleExample;
use App\Processes\Values\RuleReference;
use App\Processes\Values\RuleScope;
use App\Processes\Values\ShippedReader;
use App\Processes\Values\ToolVersions;
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
        private SpoolRecorder $recorder,
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
        $requestId = $this->commands->run(new OpenCommandRequest(
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
        $this->commands->run(new ProposeCommandRule($requestId, $draftKey, $proposed));
        $runs = [];

        foreach ($reader->samples() as $sample) {
            if ($sample->provesABranch()) {
                $runs[] = $this->recordSample($requestId, $reader, $sample);
            }
        }

        $readerId = $this->commands->run(new ProposeReader($requestId, 1, $reader->reader));
        $proofId = $this->commands->run(new ProveReader($requestId, $readerId, $runs));
        $approval = new OwnerApproval(1, 0, [new ReaderApproval($readerId, $proofId)], 'Core ships this reader.');
        $proposal = RuleProposal::query()->where('command_request_id', $requestId)->sole();
        $this->commands->run(new ApproveRuleProposal($proposal->id, $approval));
    }

    private function coreRule(ShippedReader $reader): CommandRule
    {
        $rules = array_filter(
            $this->coreRules->declaredRules(),
            fn (CommandRule $rule): bool => $rule->id === $reader->operation,
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
        $rule = CommandRule::fromArray([...$core->toArray(), 'contracts' => [$contract->toArray()]]);

        return $rule->ownedBy(RuleScope::project(), 1)
            ->replacing(new RuleReference(RuleScope::core(), $core->id, $core->revision));
    }

    /**
     * One stored sample recorded as an owner-approved sample run of the request, and the request settled after it.
     */
    private function recordSample(string $requestId, ShippedReader $reader, ProofSample $sample): string
    {
        $request = CommandRequest::query()->findOrFail($requestId);
        $permit = $this->commands->run(new ApproveSample($requestId, 1, $request->source_digest));
        $runId = $this->commands->run(new StartSample($requestId, $permit, "shipped-{$reader->tool}-{$sample->file}"));
        $run = ProcessRun::ofAnyActor($runId);
        $part = PartRun::create($run, new PartKey(1, 1, $reader->invocation));
        $part->start('shipped');
        $bytes = $reader->outputOf($sample);
        $this->recorder->append(new CapturedChunk($part, OutputStream::Stdout, $bytes, CarbonImmutable::now()));
        $part->finishProcess($sample->end());
        $part->finishDraining();
        $this->recorder->finish($part, $sample->end());
        $this->summaries->of($run);
        $read = EvidenceRange::bytes($part->id, EvidenceSource::of(OutputStream::Stdout), 0, strlen($bytes));
        $this->commands->run(new RecordEvidenceReads($run->id, [$read]));
        $this->commands->run(new SettleSample($requestId));

        return $runId;
    }
}
