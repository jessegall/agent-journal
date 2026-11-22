<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use Closure;
use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Commands\EditPlan;
use Domain\Plans\Commands\RequestPlanReview;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Commands\WithdrawPlanReview;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Exceptions\PlanUnderReview;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Commands\EditTask;
use Domain\Tasks\Models\Task;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * Users 15883 and 15889: a plan under review holds still. Requesting a review puts the plan in Reviewing and refuses
 * every change to it, its phases and its tasks until the review is withdrawn or decided; no copy of the plan is made.
 */
final class PlanReviewTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'plans',
        'phases',
        'phase_tasks',
        'plan_review_editions',
        'tasks',
        'command_receipts',
    ];

    /**
     * @return iterable<string, array{Closure(self, Plan, Task): mixed}>
     */
    public static function changes(): iterable
    {
        yield 'editing the plan' => [fn (self $test, Plan $plan) => $test->runCommand(
            new EditPlan($plan->id, $plan->revision, 'Another title'),
        )];

        yield 'cancelling the plan' => [fn (self $test, Plan $plan) => $test->runCommand(
            new CancelPlan($plan->id, $plan->revision, 'Not needed.'),
        )];

        yield 'adding a phase' => [fn (self $test, Plan $plan) => $test->structure()->addPhase($plan, 'Checking')];

        yield 'adding a task to a phase' => [fn (self $test, Plan $plan) => $test->structure()->addTasks(
            $plan->phases()->sole(),
            [Task::factory()->create()->id],
        )];

        yield 'editing a task of the plan' => [fn (self $test, Plan $plan, Task $task) => $test->runCommand(
            new EditTask($task->id, $task->revision, brief: 'Read the new notes.'),
        )];
    }

    public function test_a_requested_review_holds_the_plan_and_a_withdrawal_frees_it(): void
    {
        [$plan, $task] = $this->planWithTask();

        $reviewId = $this->runCommand(new RequestPlanReview($plan->id, [$this->owner()]));

        $this->assertSame(PlanState::Reviewing, $plan->refresh()->state);
        $this->assertSame(1, PlanReviewEdition::query()->whereKey($reviewId)->sole()->number);
        $this->assertThrows(fn () => $this->runCommand(new StartPlan($plan->id)));

        $this->runCommand(new WithdrawPlanReview($plan->id));

        $this->assertSame(PlanState::Planned, $plan->refresh()->state);
        $review = PlanReviewEdition::query()->whereKey($reviewId)->sole();
        $this->assertSame(PlanReviewState::Withdrawn, $review->state);
        $this->assertSame($this->owner->id, $review->decided_by_id);

        $this->runCommand(new EditTask($task->id, $task->refresh()->revision, brief: 'Read the new notes.'));
        $this->assertSame('Read the new notes.', $task->refresh()->brief);
    }

    /**
     * @param  Closure(self, Plan, Task): mixed  $change
     */
    #[DataProvider('changes')]
    public function test_a_change_to_a_plan_under_review_is_refused(Closure $change): void
    {
        [$plan, $task] = $this->planWithTask();
        $this->runCommand(new RequestPlanReview($plan->id, [$this->owner()]));

        $this->assertThrows(
            fn () => $change($this, $plan->refresh(), $task->refresh()),
            PlanUnderReview::class,
            "Plan {$plan->number} is under review, so it can't change now.",
        );

        $this->assertSame(PlanState::Reviewing, $plan->refresh()->state);
        $this->assertSame('Read the notes.', $task->refresh()->brief);
        $this->assertSame(1, $plan->phases()->count());
    }

    public function test_a_caller_with_no_actor_is_refused(): void
    {
        $plan = Plan::factory()->create();
        $this->app->make(CurrentActorSetter::class)->clear();

        $this->assertThrows(fn () => $this->runCommand(new RequestPlanReview($plan->id, [$this->owner()])));
        $this->assertSame(PlanState::Planned, $plan->refresh()->state);
        $this->assertSame(0, PlanReviewEdition::query()->count());
    }

    public function runCommand(object $command): mixed
    {
        return $this->app->make(CommandBus::class)->run($command);
    }

    public function structure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    /**
     * A plan with one phase holding one task, made by the owner.
     *
     * @return array{Plan, Task}
     */
    private function planWithTask(): array
    {
        $plan = Plan::factory()->create(['title' => 'Build the release page']);
        $task = Task::factory()->create(['title' => 'Read', 'brief' => 'Read the notes.']);
        $this->startUserRequestAs($this->owner->id);
        $this->structure()->addTasks($this->structure()->addPhase($plan, 'Reading'), [$task->id]);

        return [$plan->refresh(), $task];
    }

    private function owner(): ActorIdentity
    {
        return new ActorIdentity(ActorType::User, $this->owner->id);
    }
}
