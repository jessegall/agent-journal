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
use App\Values\OwnerAuthority;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\WorkingOnPlanStateReference;
use Domain\Plans\Support\States\WorkingOnPlanState;
use Domain\Plans\Tests\TestCase;
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
        $state = $this->planFrame($restorer, $row)->state;
        $this->assertInstanceOf(WorkingOnPlanState::class, $state);
        $this->assertSame([$plan->id, $plan->number], [$state->plan->planId, $state->plan->number]);

        Plan::query()->whereKey($plan->id)->update(['state' => PlanState::Cancelled->value]);

        $this->assertTrue($this->planFrame($restorer, $row)->isFinished());
        $this->assertTrue($restorer->restore($row->frames, $row->target())->top()->isBottom());
    }

    /**
     * The plan's frame as stored, finished or not: the walk passes over it once it is finished, the stack keeps it.
     */
    private function planFrame(StackRestorer $restorer, AgentStackRow $row): Frame
    {
        $frames = $restorer->restore($row->frames, $row->target())->frames();

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
