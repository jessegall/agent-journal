<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\ActorType;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\Storage\FrameRecord;
use App\Values\OwnerAuthority;
use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use Domain\Plans\Tests\TestCase;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;

/**
 * Each agent named to review a plan gets the review on its stack once the request commits; a
 * user named as reviewer works on no stack and gets nothing.
 */
final class PlanReviewStateTest extends TestCase
{
    use CommittedHookStack;

    protected function tearDown(): void
    {
        $this->emptyTables('plan_review_editions', 'phase_tasks', 'phases', 'plans');

        parent::tearDown();
    }

    public function test_an_agent_named_as_reviewer_gets_the_review_on_its_stack(): void
    {
        $plan = Plan::factory()->create();
        $this->actAsUser();

        $this->app->make(CommandBus::class)->run(new RequestPlanReviewCommand($plan->id, [
            new ActorIdentity(ActorType::Agent, TestIds::of(1)),
            new ActorIdentity(ActorType::User, TestIds::of(7)),
        ]));

        $this->assertSame([ReviewPlanStateReference::TYPE_KEY], $this->frameTypes());
        $this->assertSame($plan->id, $this->frames()[0]->reference->subject?->id);
    }

    public function test_a_review_with_only_a_user_as_reviewer_changes_no_stack(): void
    {
        $plan = Plan::factory()->create();
        $this->actAsUser();

        $this->app->make(CommandBus::class)->run(new RequestPlanReviewCommand($plan->id, [
            new ActorIdentity(ActorType::User, TestIds::of(7)),
        ]));

        $this->assertSame([], $this->frameTypes());
    }

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
    }

    /**
     * @return list<FrameRecord>
     */
    private function frames(): array
    {
        return array_values(array_filter(
            AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(),
            fn (FrameRecord $frame) => ! $frame->isBottom,
        ));
    }

    /**
     * @return list<string>
     */
    private function frameTypes(): array
    {
        return array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->frames());
    }
}
