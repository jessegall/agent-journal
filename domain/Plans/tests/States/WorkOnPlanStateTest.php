<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\States;

use App\Models\Agents\AgentSession;
use App\Values\AgentText;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Support\States\Support\WorkOnPlanStateReference;
use Domain\Plans\Support\States\WorkOnPlanState;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\StateObservation;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An agent that starts a plan gets the plan's working frame in the same command; the plan stays its current plan until
 * the plan is done or cancelled, and a user's start changes no stack.
 */
#[TestsState(WorkOnPlanState::class)]
final class WorkOnPlanStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'agent_stacks',
        'command_receipts',
    ];

    private const string PLAN = 'Build the release page';

    private PlanFixtures $plans;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner');
        $this->plans = $this->journal->fixtures(PlanFixtures::class)->plan(self::PLAN);
    }

    #[TimeLimit(seconds: 3, reason: 'It starts a plan through the bus twice, each with its stack transaction.')]
    public function test_an_agent_starting_a_plan_gets_its_working_frame_once(): void
    {
        $this->journal->actAs('Planner')->run(new StartPlanCommand($this->planId()));
        $this->journal->run(new StartPlanCommand($this->planId()));

        $this->journal->stateOn($this->planner(), WorkOnPlanStateReference::forPlan($this->planId()))
            ->given([], fn (StateObservation $state) => $state->assertOnTop());
    }

    public function test_a_user_starting_a_plan_changes_no_stack(): void
    {
        $this->journal->actAs('Owner')->run(new StartPlanCommand($this->planId()));

        $this->journal->assertNoFrame($this->planner(), WorkOnPlanStateReference::forPlan($this->planId()));
    }

    public function test_a_plan_frame_is_finished_once_the_plan_is_done_or_cancelled(): void
    {
        $working = $this->journal->pushState($this->planner(), WorkOnPlanStateReference::forPlan($this->planId()))
            ->given([], fn (StateObservation $state) => $state->assertOnTop());

        $plan = $this->plans->planCalled(self::PLAN);
        $this->journal->actAs('Owner')->run(new CancelPlanCommand($plan->id, $plan->revision, 'No longer needed'));

        $working->given([], fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_the_frame_shows_the_newest_counts_it_heard_and_ignores_an_older_count_arriving_late(): void
    {
        $state = new WorkOnPlanState('plan-1');

        $state->onPlanProgressChanged(new PlanProgressChanged('plan-1', 12, 3, 8, 2_000));
        $state->onPlanProgressChanged(new PlanProgressChanged('plan-1', 12, 2, 8, 1_000));

        $this->assertFalse($state->hears(new PlanProgressChanged('plan-2', 40, 9, 9, 3_000)));

        $this->assertEquals(
            AgentText::of('plans.working_on', [
                'plan' => 12,
                'finished' => 3,
                'total' => 8,
            ]),
            $state->instruction()->get(),
        );
    }

    public function test_placing_a_task_tells_the_plans_new_counts(): void
    {
        $phase = $this->plans->phase(self::PLAN, 'Work')->phaseCalled('Work');
        $task = $this->journal->fixtures(TaskFixtures::class)->createTask('Write it');
        $this->journal->observeEvents(PlanProgressChanged::class);

        $this->journal->actAs('Owner')->run(new AddPhaseTasksCommand($phase->id, $phase->revision, [$task->id]));

        $this->journal->assertEventCount(PlanProgressChanged::class, 1)->assertEvent(
            PlanProgressChanged::class,
            fn (PlanProgressChanged $changed) => [
                $changed->hasFinished,
                $changed->total,
            ] === [
                0,
                1,
            ],
        );
    }

    private function planId(): string
    {
        return $this->plans->planCalled(self::PLAN)->id;
    }

    private function planner(): AgentSession
    {
        return $this->journal->sessionOf('Planner');
    }
}
