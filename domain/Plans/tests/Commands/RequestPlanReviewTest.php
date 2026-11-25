<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorReference;
use Closure;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Commands\EditPlan\EditPlanCommand;
use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Commands\WithdrawPlanReview\WithdrawPlanReviewCommand;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Exceptions\PlanUnderReview;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Commands\EditTask\EditTaskCommand;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Seeding\StateObservation;

/**
 * A plan under review holds still. Requesting a review puts the plan in Reviewing and refuses
 * every change to it, its phases and its tasks until the review is withdrawn or decided; no copy of the plan is made.
 */
#[TestsCommand(RequestPlanReviewCommand::class)]
final class RequestPlanReviewTest extends TestCase
{
    use CommitsHookRows;

    private const string BRIEF = 'Read the notes.';

    private const string NEW_BRIEF = 'Read the new notes.';

    private const array TABLES = [
        'users',
        'plans',
        'phases',
        'phase_tasks',
        'plan_review_editions',
        'tasks',
        'command_receipts',
        'number_groups',
        'agent_stacks',
    ];

    /**
     * @return iterable<string, array{Closure(self, Plan, Task): mixed}>
     */
    public static function changes(): iterable
    {
        yield 'editing the plan' => [fn (self $test, Plan $plan) => $test->runCommand(
            new EditPlanCommand($plan->id, $plan->revision, 'Another title'),
        )];

        yield 'cancelling the plan' => [fn (self $test, Plan $plan) => $test->runCommand(
            new CancelPlanCommand($plan->id, $plan->revision, 'Not needed.'),
        )];

        yield 'adding a phase' => [fn (self $test, Plan $plan) => $test->structure()->addPhase($plan, 'Checking')];

        yield 'adding a task to a phase' => [fn (self $test, Plan $plan) => $test->structure()->addTasks(
            $plan->phases()->sole(),
            [Task::factory()->create()->id],
        )];

        yield 'editing a task of the plan' => [fn (self $test, Plan $plan, Task $task) => $test->runCommand(
            new EditTaskCommand($task->id, $task->revision, brief: self::NEW_BRIEF),
        )];
    }

    public function test_a_requested_review_holds_the_plan_and_a_withdrawal_frees_it(): void
    {
        [$plan, $task] = $this->planWithTask();

        $reviewId = $this->runCommand(new RequestPlanReviewCommand($plan->id, [$this->owner()]));

        $this->assertSame(PlanStatus::Reviewing, $plan->refresh()->status);
        $this->assertSame(1, PlanReviewEdition::query()->whereKey($reviewId)->sole()->number);
        $this->assertThrows(fn () => $this->runCommand(new StartPlanCommand($plan->id)));

        $this->runCommand(new WithdrawPlanReviewCommand($plan->id));

        $this->assertSame(PlanStatus::Planned, $plan->refresh()->status);
        $review = PlanReviewEdition::query()->whereKey($reviewId)->sole();
        $this->assertSame(PlanReviewStatus::Withdrawn, $review->status);
        $this->assertSame($this->journal->ownerUser()->id, $review->decided_by_id);

        $this->runCommand(new EditTaskCommand($task->id, $task->refresh()->revision, brief: self::NEW_BRIEF));
        $this->assertSame(self::NEW_BRIEF, $task->refresh()->brief);
    }

    /**
     * @param  Closure(self, Plan, Task): mixed  $change
     */
    #[DataProvider('changes')]
    public function test_a_change_to_a_plan_under_review_is_refused(Closure $change): void
    {
        [$plan, $task] = $this->planWithTask();
        $this->runCommand(new RequestPlanReviewCommand($plan->id, [$this->owner()]));

        $this->assertThrows(
            fn () => $change($this, $plan->refresh(), $task->refresh()),
            PlanUnderReview::class,
            PlanUnderReview::forPlan($plan->number)->getMessage(),
        );

        $this->assertSame(PlanStatus::Reviewing, $plan->refresh()->status);
        $this->assertSame(self::BRIEF, $task->refresh()->brief);
        $this->assertSame(1, $plan->phases()->count());
    }

    public function test_a_caller_with_no_actor_is_refused(): void
    {
        $plan = $this->journal->owner()->fixtures(PlanFixtures::class)->plan('Release')->planCalled('Release');
        $this->app->make(CurrentActorSetter::class)->clear();

        $this->assertThrows(fn () => $this->runCommand(new RequestPlanReviewCommand($plan->id, [$this->owner()])));
        $this->assertSame(PlanStatus::Planned, $plan->refresh()->status);
        $this->assertSame(0, PlanReviewEdition::query()->count());
    }

    public function test_an_agent_named_as_reviewer_gets_the_review_on_its_stack(): void
    {
        $plan = $this->reviewersPlan();

        $this->journal->actAs('Owner')->run(new RequestPlanReviewCommand($plan->id, [
            $this->journal->actorCalled('Reviewer'),
            $this->journal->actorCalled('Ada'),
        ]));

        $this->journal
            ->stateOn(
                $this->journal->sessionOf('Reviewer'),
                ReviewPlanStateReference::forPlan($plan->id, $plan->number),
            )
            ->given([], fn (StateObservation $state) => $state->assertOnTop());
    }

    public function test_a_review_with_only_a_user_as_reviewer_changes_no_stack(): void
    {
        $plan = $this->reviewersPlan();

        $this->journal->actAs('Owner')->run(
            new RequestPlanReviewCommand($plan->id, [$this->journal->actorCalled('Ada')]),
        );

        $this->journal->assertNoFrame(
            $this->journal->sessionOf('Reviewer'),
            ReviewPlanStateReference::forPlan($plan->id, $plan->number),
        );
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
        $this->journal->owner();
        $task = $this->journal->fixtures(TaskFixtures::class)->task('Read', self::BRIEF)->taskCalled('Read');

        $plan = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release', title: 'Build the release page')
            ->phaseWithTask('Release', 'Reading', $task->assignmentIdentity())
            ->planCalled('Release');

        return [
            $plan->refresh(),
            $task,
        ];
    }

    /**
     * A plan of the owner, whose agent Reviewer runs a session and whose user Ada does not.
     */
    private function reviewersPlan(): Plan
    {
        $this->journal->owner()->agent('Reviewer')->user('Ada');

        return $this->journal->fixtures(PlanFixtures::class)->plan('Release')->planCalled('Release');
    }

    private function owner(): ActorReference
    {
        return $this->journal->actorCalled('Owner');
    }
}
