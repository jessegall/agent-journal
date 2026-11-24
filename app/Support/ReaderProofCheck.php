<?php

declare(strict_types=1);

namespace App\Support;

use App\Declarations\VerificationContract;
use App\Exceptions\ReaderProofFailed;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ReaderRevision;
use App\Values\ExitBranch;
use App\Values\OutputProblem;
use App\Values\ProvenBranch;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * The journal's own proof of a draft reader: every run must be a complete sample
 * the journal captured for this request and read by its actor; the reader is replayed over the stored bytes and must
 * account for every record without a problem, claim what the run's exit branch means, and honour the empty policy;
 * every exit branch of the contract needs a run. A statement or copied text never counts.
 */
final readonly class ReaderProofCheck
{
    public function __construct(private ReaderReplay $replays, private ManifestCheck $manifests) {}

    /**
     * @param  list<string>  $runIds
     * @return list<ProvenBranch>
     *
     * @throws ReaderProofFailed
     */
    public function prove(
        CommandRequest $request,
        ReaderRevision $reader,
        VerificationContract $contract,
        array $runIds,
    ): array {
        $samples = EvidencePermit::query()->sampling($request)->limit(100)->pluck('process_run_id')->all();
        $runs = ProcessRun::query()->ownedBy($request->actor())->whereKey($runIds)->limit(100)->get()->keyBy('id');
        $failures = [];
        $proven = [];

        foreach ($runIds as $runId) {
            if (! in_array($runId, $samples, true)) {
                $failures[] = "run {$runId} is no sample the journal captured for this request";

                continue;
            }

            $run = $runs->get($runId) ?? throw new ModelNotFoundException()->setModel(ProcessRun::class, [$runId]);
            $part = $this->samplePart($request, $run);
            $runFailures = $this->runFailures($request, $run, $part);

            if ($runFailures === []) {
                $runFailures = $this->replayFailures($reader, $contract, $part);
            }

            if ($runFailures === []) {
                $proven[] = $this->branchOf($contract, $part);
            }

            foreach ($runFailures as $failure) {
                $failures[] = "run {$runId}: {$failure}";
            }
        }

        $unproven = $this->unprovenStatuses($contract, $proven);

        if ($failures !== [] || $unproven !== []) {
            throw ReaderProofFailed::because($failures, $unproven);
        }

        return $proven;
    }

    private function samplePart(CommandRequest $request, ProcessRun $run): PartRun|null
    {
        return $run->parts()->where('operation', $request->operation)->orderByDesc('attempt')->first();
    }

    /**
     * @return list<string>
     */
    private function runFailures(CommandRequest $request, ProcessRun $run, PartRun|null $part): array
    {
        if ($part === null) {
            return ["no part of the run is {$request->operation}"];
        }

        if (! $run->hasEnded() || ! $part->end->hasStatus()) {
            return ['the run has not ended with its own exit status'];
        }

        $manifest = $this->manifests->stateOf($part);

        if (! $part->capture_state->isComplete() || ! $manifest->isComplete()) {
            return ['its captured output is not complete'];
        }

        if (! $request->hasReadEvidence($run)) {
            return ["the request's actor has not read its envelope and every stream it wrote"];
        }

        return [];
    }

    /**
     * @return list<string>
     */
    private function replayFailures(ReaderRevision $reader, VerificationContract $contract, PartRun $part): array
    {
        $assessment = $this->replays->replay($reader, $contract, $part)->assessment;

        $failures = array_map(
            fn (OutputProblem $problem): string => sprintf(
                '%s at %s bytes %s-%s: %s',
                $problem->code->value,
                $problem->stream?->value,
                $problem->start,
                $problem->end,
                $problem->explanation,
            ),
            $assessment->problems,
        );

        $outcome = $contract->exits->outcomeOf($part->end_code);

        if (! $outcome->acceptsClaim($assessment->claimed)) {
            $claimed = $assessment->claimed->value;
            $failures[] = "the reader claims {$claimed} for exit {$part->end_code}, which means {$outcome->value}";
        }

        if ($assessment->records === [] && $contract->output->isEmptyRefused()) {
            $failures[] = 'the reader found no record and the contract does not allow an empty output';
        }

        return $failures;
    }

    private function branchOf(VerificationContract $contract, PartRun $part): ProvenBranch
    {
        return new ProvenBranch(
            $part->end_code,
            $contract->exits->outcomeOf($part->end_code),
            $part->process_run_id,
            $part->id,
            $part->manifestDigests(),
        );
    }

    /**
     * @param  list<ProvenBranch>  $proven
     * @return list<int>
     */
    private function unprovenStatuses(VerificationContract $contract, array $proven): array
    {
        $covered = array_map(fn (ProvenBranch $branch): int => $branch->status, $proven);
        $missing = $contract->exits->branchesMissing($covered);

        return array_map(fn (ExitBranch $branch): int => $branch->status, $missing);
    }
}
