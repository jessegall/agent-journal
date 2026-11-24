<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\AssessPartOutput\AssessPartOutputCommand;
use App\Contracts\Bus\ResultReceipts;
use App\Enums\AssessmentOutcome;
use App\Enums\ProblemCode;
use App\Enums\RunMode;
use App\Events\EvidenceFoundInvalid;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ResultReceipt;
use App\Values\OutputProblem;
use Illuminate\Support\Facades\Event;
use Tests\Support\Processes\StartsWithApprovedAcmePair;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * A check's run gets a result receipt only through the evidence validator, from a valid assessment by its approved
 * reader; anything else is a stored assessment with problem codes and no result.
 */
final class ResultReceiptTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;
    use StartsWithApprovedAcmePair;

    public function test_a_valid_passing_run_gets_a_receipt_bound_to_its_revisions(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);

        $receiptId = $this->runAsAgent(new AssessPartOutputCommand($part->id));

        $receipt = ResultReceipt::query()->findOrFail($receiptId);
        $this->assertSame(AssessmentOutcome::Passed, $receipt->outcome);
        $this->assertSame($part->id, $receipt->part_run_id);
        $this->assertSame($receiptId, $this->app->make(ResultReceipts::class)->forPart($part->id)->get()->receiptId);
    }

    public function test_unrecognized_bytes_give_no_receipt_and_the_invalid_evidence_is_told(): void
    {
        Event::fake([EvidenceFoundInvalid::class]);
        $part = $this->normalRun(0, "error: disk full\n".self::PASSED_OUTPUT);

        $this->assertSame('', $this->runAsAgent(new AssessPartOutputCommand($part->id)));

        $this->assertContains(ProblemCode::OutputUnrecognized, $this->codesOf($part));
        $this->assertSame(0, ResultReceipt::query()->count());
        Event::assertDispatched(EvidenceFoundInvalid::class);
    }

    public function test_an_exit_that_disagrees_with_the_output_is_an_outcome_conflict(): void
    {
        $part = $this->normalRun(0, self::FINDINGS_OUTPUT);

        $this->runAsAgent(new AssessPartOutputCommand($part->id));

        $this->assertContains(ProblemCode::OutcomeConflict, $this->codesOf($part));
    }

    public function test_an_undeclared_exit_status_is_an_execution_error_not_findings(): void
    {
        $part = $this->normalRun(3, self::FINDINGS_OUTPUT);

        $this->runAsAgent(new AssessPartOutputCommand($part->id));

        $this->assertContains(ProblemCode::ExecutionError, $this->codesOf($part));
        $assessment = OutputAssessment::query()->where('part_run_id', $part->id)->sole();
        $this->assertSame(AssessmentOutcome::Unavailable, $assessment->outcome);
    }

    public function test_an_evidence_run_never_gets_a_receipt(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT, RunMode::Evidence);

        $this->runAsAgent(new AssessPartOutputCommand($part->id));

        $this->assertContains(ProblemCode::NotNormalRun, $this->codesOf($part));
        $this->assertSame(0, ResultReceipt::query()->count());
    }

    public function test_a_replay_appends_an_assessment_and_supersedes_the_earlier_receipt(): void
    {
        $part = $this->normalRun(0, self::PASSED_OUTPUT);
        $first = $this->runAsAgent(new AssessPartOutputCommand($part->id));

        $second = $this->runAsAgent(new AssessPartOutputCommand($part->id));

        $assessments = OutputAssessment::query()
            ->where('part_run_id', $part->id)
            ->orderBy('created_at')
            ->orderBy('id')
            ->get();
        $this->assertCount(2, $assessments);
        $this->assertSame($assessments[0]->id, $assessments[1]->replaces_assessment_id);
        $this->assertSame($second, ResultReceipt::query()->findOrFail($first)->superseded_by_id);
    }

    /**
     * @return list<ProblemCode>
     */
    private function codesOf(PartRun $part): array
    {
        $assessment = OutputAssessment::query()->where('part_run_id', $part->id)->latest('created_at')->firstOrFail();

        return array_map(fn (OutputProblem $problem): ProblemCode => $problem->code, $assessment->problems);
    }
}
