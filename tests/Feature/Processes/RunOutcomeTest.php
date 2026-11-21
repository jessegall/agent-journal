<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Enums\RunLogicalResult;
use App\Processes\Enums\RunRequestIntent;
use App\Processes\Enums\RunResultSource;
use App\Processes\Enums\StepType;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RunOutcome;
use App\Processes\Models\RunResultConflict;
use App\Processes\Support\RunOutcomes;
use App\Processes\Values\ExecutionPlan;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * A run attempt keeps one logical result: the root status decides it, a lost attempt is provisionally unknown until
 * a signed result corrects it in place, and a second signed result that disagrees is refused and kept.
 */
final class RunOutcomeTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_admitted_run_keeps_its_intent_responsible_actor_and_an_attempt(): void
    {
        $run = $this->run();

        $this->assertSame(RunRequestIntent::ExplicitRequest, $run->request_intent);
        $this->assertSame(TestActors::agentIdentity(3)->id, $run->responsible_id);
        $this->assertNotNull($run->attempt_id);
    }

    public function test_the_root_status_decides_the_result_whatever_a_part_did(): void
    {
        $this->assertSame(RunLogicalResult::Succeeded, RunLogicalResult::ofRootStatus(0));
        $this->assertSame(RunLogicalResult::Failed, RunLogicalResult::ofRootStatus(2));
    }

    public function test_a_lost_attempt_is_unknown_until_a_signed_result_corrects_the_same_row(): void
    {
        $run = $this->run();
        $outcomes = $this->app->make(RunOutcomes::class);

        $outcomes->record($run, RunLogicalResult::Unknown, RunResultSource::Provisional);
        $first = RunOutcome::query()->sole();
        $outcomes->record($run, RunLogicalResult::Succeeded, RunResultSource::Signed);
        $outcomes->record($run, RunLogicalResult::Unknown, RunResultSource::Provisional);

        $kept = RunOutcome::query()->sole();
        $this->assertSame($first->id, $kept->id);
        $this->assertSame(RunLogicalResult::Succeeded, $kept->result);
        $this->assertSame(2, $kept->version);
    }

    public function test_a_second_signed_result_that_disagrees_keeps_the_first_and_records_the_conflict(): void
    {
        $run = $this->run();
        $outcomes = $this->app->make(RunOutcomes::class);

        $outcomes->record($run, RunLogicalResult::Failed, RunResultSource::Signed);
        $outcomes->record($run, RunLogicalResult::Succeeded, RunResultSource::Signed);

        $this->assertSame(RunLogicalResult::Failed, RunOutcome::query()->sole()->result);
        $this->assertSame(RunLogicalResult::Succeeded, RunResultConflict::query()->sole()->offered_result);
    }

    public function test_a_plan_that_only_starts_a_background_child_only_finished(): void
    {
        $plan = ExecutionPlan::from([
            'root' => [
                'type' => StepType::Sequence,
                'node' => 0,
                'context' => 0,
                'children' => [['type' => StepType::Background, 'node' => 1, 'context' => 0]],
            ],
            'tree_digest' => str_repeat('b', 64),
        ]);

        $this->assertSame('Requested shell plan finished', RunLogicalResult::Succeeded->summaryFor($plan));
    }

    private function run(): ProcessRun
    {
        return ProcessRun::create(TestActors::agentIdentity(3), TestRunAdmissions::of());
    }
}
