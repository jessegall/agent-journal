<?php

declare(strict_types=1);

namespace App\Support;

use App\Declarations\VerificationContract;
use App\Enums\AssessmentOutcome;
use App\Enums\LifecycleState;
use App\Enums\Outcome;
use App\Enums\PartEndType;
use App\Enums\ProblemCode;
use App\Enums\RunMode;
use App\Exceptions\EvidenceRejected;
use App\Models\OutputAssessment;
use App\Models\PartRun;
use App\Models\ProcessRun;
use App\Models\RuleRevision;
use App\Values\OutputProblem;
use App\Values\OutputValidation;
use App\Values\ReaderAssessment;
use App\Values\ReaderCheckpoint;
use App\Values\VerifiedOutput;

/**
 * The one boundary between a run and a result (doc 21 revision 6, sections 69 and 72): a normal run whose part ended
 * with its own exit, whose capture is complete and verified, whose approved reader consumed every byte without a
 * problem and claimed what the exit branch means, and whose empty policy holds. Anything else is a problem with a
 * stable code; an execution error is never findings.
 */
final readonly class EvidenceValidator
{
    public function __construct(private ManifestCheck $manifests) {}

    public function validate(
        PartRun $part,
        ReaderAssessment $read,
        ReaderCheckpoint $consumed,
        VerificationContract $contract,
    ): OutputValidation {
        $run = ProcessRun::ofAnyActor($part->process_run_id);
        $problems = [...$this->runProblems($run, $part), ...$read->problems];

        if ($consumed->offsets != $part->stream_offsets) {
            $problems[] = $this->problem(ProblemCode::OutputIncomplete, 'The reader left captured bytes unread.');
        }

        if ($part->end_type !== PartEndType::Exited) {
            return new OutputValidation($problems, AssessmentOutcome::Unavailable);
        }

        $outcome = $contract->exits->outcomeOf($part->end_code);

        if ($outcome === Outcome::ExecutionError) {
            $problems[] = $this->problem(ProblemCode::ExecutionError, "Exit {$part->end_code} is no declared branch.");
        } elseif (! $outcome->acceptsClaim($read->claimed)) {
            $claim = "The output claims {$read->claimed->value} but exit {$part->end_code} means {$outcome->value}.";
            $problems[] = $this->problem(ProblemCode::OutcomeConflict, $claim);
        }

        $empty = $read->records === [];

        if ($empty && $contract->output->isEmptyRefused()) {
            $problems[] = $this->problem(ProblemCode::OutputMissing, 'The contract does not allow an empty output.');
        }

        if ($problems !== []) {
            return new OutputValidation($problems, AssessmentOutcome::Unavailable);
        }

        return new OutputValidation([], $empty ? AssessmentOutcome::AllowedEmpty : AssessmentOutcome::of($outcome));
    }

    /**
     * The verified output of a stored valid assessment, after reading its part and run again.
     *
     * @throws EvidenceRejected
     */
    public function verify(OutputAssessment $assessment): VerifiedOutput
    {
        $part = PartRun::query()->findOrFail($assessment->part_run_id);
        $run = ProcessRun::ofAnyActor($part->process_run_id);

        if (! $assessment->isValid() || $this->runProblems($run, $part) !== []) {
            throw EvidenceRejected::notValid($assessment->id);
        }

        $declaration = RuleRevision::query()->findOrFail($assessment->rule_revision_id);
        $manifest = hash('sha256', json_encode($part->manifestDigests(), JSON_THROW_ON_ERROR));

        return new VerifiedOutput($run, $part, $declaration, $assessment, $manifest);
    }

    /**
     * @return list<OutputProblem>
     */
    private function runProblems(ProcessRun $run, PartRun $part): array
    {
        $problems = [];

        if ($run->mode !== RunMode::Normal) {
            $problems[] = $this->problem(ProblemCode::NotNormalRun, 'An evidence sample never gives a result.');
        }

        if ($part->lifecycle !== LifecycleState::Ended || $part->end_type !== PartEndType::Exited) {
            $problems[] = $this->problem(ProblemCode::ExitUnavailable, 'The part did not end with its own exit.');
        }

        $manifest = $this->manifests->stateOf($part);

        if (! $part->capture_state->isComplete() || ! $manifest->isComplete()) {
            $problems[] = $this->problem(ProblemCode::OutputIncomplete, 'The captured output is not complete.');
        }

        return $problems;
    }

    private function problem(ProblemCode $code, string $explanation): OutputProblem
    {
        return OutputProblem::ofWholeOutput($code, '', $explanation);
    }
}
