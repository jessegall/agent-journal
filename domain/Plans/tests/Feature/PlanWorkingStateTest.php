<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Work\CurrentState;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorContext;
use App\Support\Stack\Frames\Frame;
use App\Support\Stack\StackRestorer;
use App\Support\Storage\FrameRecord;
use App\Values\AgentText;
use App\Values\OwnerAuthority;
use Domain\Plans\Commands\AddPhaseTasks\AddPhaseTasksCommand;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Support\States\Support\WorkingOnPlanStateReference;
use Domain\Plans\Support\States\WorkingOnPlanState;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An agent that starts a plan gets the plan's working frame in the same command; the plan stays its current plan until
 * the plan is done or cancelled, and a user's start changes no stack.
 */
final class PlanWorkingStateTest extends TestCase
{
    use CommittedHookStack;

    protected function tearDown(): void
    {
        $this->emptyTables('phase_tasks', 'phases', 'plans');

        parent::tearDown();
    }

    #[TimeLimit(seconds: 3, reason: 'It starts a plan through the bus twice, each with its stack transaction.')]
    public function test_an_agent_starting_a_plan_gets_its_working_frame_once(): void
    {
        $plan = $this->plan();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(1)),
            TestStartAuthority::forAgent(TestIds::of(1)),
        );

        $this->app->make(CommandBus::class)->run(new StartPlanCommand($plan->id));
        $this->app->make(CommandBus::class)->run(new StartPlanCommand($plan->id));

        $this->assertSame([WorkingOnPlanStateReference::TYPE_KEY], $this->frameTypes());

        $this->assertSame(
            $plan->id,
            $this->app->make(CurrentState::class)->of(
                $this->target,
                WorkingOnPlanStateReference::TYPE_KEY,
            )->get()->subject->id,
        );
    }

    public function test_a_user_starting_a_plan_changes_no_stack(): void
    {
        $plan = $this->plan();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(new StartPlanCommand($plan->id));

        $this->assertSame([], $this->frameTypes());
    }

    public function test_a_plan_frame_is_finished_once_the_plan_is_done_or_cancelled(): void
    {
        $plan = $this->plan();
        $this->pushState(WorkingOnPlanStateReference::forPlan($plan->id));
        $row = AgentStackRow::query()->forTarget($this->target)->sole();
        $restorer = $this->app->make(StackRestorer::class);

        $this->assertFalse($this->planFrame($restorer, $row)->isFinished());
        $this->assertInstanceOf(WorkingOnPlanState::class, $this->planFrame($restorer, $row)->state);

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(
            new CancelPlanCommand($plan->id, $plan->refresh()->revision, 'No longer needed'),
        );

        $row = AgentStackRow::query()->forTarget($this->target)->sole();

        $this->assertTrue($this->planFrame($restorer, $row)->isFinished());
        $this->assertTrue($restorer->restore($row->frames, $row->target)->top()->isBottom());
    }

    public function test_the_frame_shows_the_newest_counts_it_heard_and_ignores_an_older_count_arriving_late(): void
    {
        $state = new WorkingOnPlanState('plan-1');

        $state->onPlanProgressChanged(new PlanProgressChanged('plan-1', 12, 3, 8, 2_000));
        $state->onPlanProgressChanged(new PlanProgressChanged('plan-1', 12, 2, 8, 1_000));
        $state->onPlanProgressChanged(new PlanProgressChanged('plan-2', 40, 9, 9, 3_000));

        $this->assertEquals(
            AgentText::of('plans.working_on', ['plan' => 12, 'finished' => 3, 'total' => 8]),
            $state->instruction()->get(),
        );
    }

    public function test_placing_a_task_tells_the_plans_new_counts(): void
    {
        $plan = $this->plan();
        $heard = [];

        Event::listen(PlanProgressChanged::class, function (PlanProgressChanged $changed) use (&$heard): void {
            $heard[] = [$changed->hasFinished, $changed->total];
        });

        $phase = $this->app->make(PlanStructure::class)->addPhase($plan, 'Work');

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(
            new AddPhaseTasksCommand($phase->id, $phase->refresh()->revision, [Task::factory()->create()->id]),
        );

        $this->assertSame([[0, 1]], $heard);
    }

    /**
     * The plan's frame as stored, finished or not: the walk passes over it once it is finished, the stack keeps it.
     */
    private function planFrame(StackRestorer $restorer, AgentStackRow $row): Frame
    {
        $frames = $restorer->restore($row->frames, $row->target)->frames();

        return $frames[array_key_last($frames)];
    }

    private function plan(): Plan
    {
        return Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
    }

    /**
     * @return list<string>
     */
    private function frameTypes(): array
    {
        $frames = array_filter(
            AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(),
            fn (FrameRecord $frame) => ! $frame->isBottom,
        );

        return array_values(array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $frames));
    }
}
