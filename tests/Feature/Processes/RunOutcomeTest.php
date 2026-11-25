<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\Runs\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessCommand;
use App\Commands\Runs\RevokeRunOutcomeAccess\RevokeRunOutcomeAccessHandler;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\CommandRules\StepType;
use App\Enums\Runs\RunEventType;
use App\Enums\Runs\RunLogicalResult;
use App\Enums\Runs\RunRequestIntent;
use App\Enums\Runs\RunResultSource;
use App\Events\Processes\RunOutcomeRecorded;
use App\Listeners\NotifyRunOutcome;
use App\Models\Access\User;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\RunOutcome;
use App\Models\Runs\RunResultConflict;
use App\Resolvers\Support\RunOutcomeSummaries;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\Execution\RecordedRunEvents;
use App\Support\RunOutcomes;
use App\Values\ExecutionPlan;
use App\Values\OwnerAuthority;
use App\Values\RunEvent;
use Tests\Fixtures\Processes\CollectedOutput;
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

    private const string PLAN_SUMMARY = 'Requested shell plan finished';

    private const string FAILED_LABEL = 'Run failed';

    public function test_an_admitted_run_keeps_its_intent_responsible_actor_and_an_attempt(): void
    {
        $run = $this->admittedRun();

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
        $run = $this->admittedRun();
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
        $run = $this->admittedRun();
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

        $this->assertSame(self::PLAN_SUMMARY, RunLogicalResult::Succeeded->summaryFor($plan));
    }

    public function test_a_signed_root_status_is_recorded_once_and_a_replay_adds_nothing(): void
    {
        $run = $this->admittedRun();

        foreach ([1, 1] as $sequence) {
            RunEvent::from(['sequence' => $sequence, 'type' => RunEventType::RunFinished, 'code' => 0])
                ->applyTo(new RecordedRunEvents($run, new CollectedOutput()));
        }

        $outcome = RunOutcome::query()->sole();
        $this->assertSame(RunLogicalResult::Succeeded, $outcome->result);
        $this->assertSame(RunResultSource::Signed, $outcome->source);
        $this->assertSame(1, $outcome->version);
    }

    public function test_a_failed_requested_run_gives_its_owner_one_receipt_and_a_correction_none_more(): void
    {
        $run = $this->admittedRun();
        $notify = $this->app->make(NotifyRunOutcome::class);

        $notify->handle(new RunOutcomeRecorded($run->id, $run->attempt_id, RunLogicalResult::Unknown, false));
        $notify->handle(new RunOutcomeRecorded($run->id, $run->attempt_id, RunLogicalResult::Failed, true));
        $notify->handle(new RunOutcomeRecorded($run->id, $run->attempt_id, RunLogicalResult::Failed, true));

        $this->assertSame(1, NotificationReceipt::query()->count());
        $this->assertSame(1, NotificationScope::query()->sole()->unread_count);
    }

    public function test_a_scheduled_success_and_a_stop_stay_quiet(): void
    {
        $scheduled = ProcessRun::create(
            TestActors::agentIdentity(3),
            TestRunAdmissions::of(intent: RunRequestIntent::ScheduledCheck),
        );
        $notify = $this->app->make(NotifyRunOutcome::class);

        $notify->handle(new RunOutcomeRecorded(
            $scheduled->id,
            $scheduled->attempt_id,
            RunLogicalResult::Succeeded,
            false,
        ));
        $requested = $this->admittedRun();
        $notify->handle(
            new RunOutcomeRecorded($requested->id, $requested->attempt_id, RunLogicalResult::Stopped, false),
        );

        $this->assertSame(0, NotificationReceipt::query()->count());
    }

    public function test_an_entitled_user_reads_only_the_safe_summary_until_the_entitlement_is_revoked(): void
    {
        $atlas = TestActors::agentIdentity(3);
        $kim = TestActors::userIdentity(4);
        $run = ProcessRun::create($atlas, TestRunAdmissions::of(
            projectKey: (string) config('processes.project_key'),
            outcomeUserId: $kim->id,
        ));
        $this->app->make(RunOutcomes::class)->record($run, RunLogicalResult::Failed, RunResultSource::Signed);
        $this->app->make(NotifyRunOutcome::class)
            ->handle(new RunOutcomeRecorded($run->id, $run->attempt_id, RunLogicalResult::Failed, false));

        $this->actAs($kim);
        $summary = $this->app->make(RunOutcomeSummaries::class)->summaryOf($run->id)->get();

        $this->assertSame(self::FAILED_LABEL, $summary->label);
        $this->assertSame(substr($run->attempt_id, -8), $summary->attemptReference);
        $this->assertTrue($summary->mayOpenFullRun);
        $this->assertSame(2, NotificationReceipt::query()->count());

        $this->actAs($atlas);
        $this->app->make(RevokeRunOutcomeAccessHandler::class)->handle(
            new RevokeRunOutcomeAccessCommand($run->id)->withDispatcher(ActorContext::forAgent($atlas->id)),
        );

        $this->assertFalse($run->refresh()->hasOutcomeFor($kim));
        $this->assertSame(
            0,
            NotificationScope::query()->where('recipient_id', $kim->id)->sole()->unread_count,
        );
    }

    private function actAs(ActorIdentity $actor): void
    {
        $this->app->forgetScopedInstances();
        $context = $actor->type === User::storedType()
            ? ActorContext::forUser($actor->id)
            : ActorContext::forAgent($actor->id);
        $this->app->make(CurrentActorSetter::class)->set($context, new OwnerAuthority('test'));
    }

    private function admittedRun(): ProcessRun
    {
        return ProcessRun::create(TestActors::agentIdentity(3), TestRunAdmissions::of());
    }
}
