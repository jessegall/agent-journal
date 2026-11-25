<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Models\Access\User;
use App\Support\ActorReference;
use Domain\Plans\Commands\ApprovePlanReview\ApprovePlanReviewCommand;
use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Commands\WithdrawPlanReview\WithdrawPlanReviewCommand;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A reviewer approves the open review of a plan: one decision is kept that a replay under its key returns, and the
 * plan may start; a decision on a review that was withdrawn is refused with its outcome.
 */
#[TestsCommand(ApprovePlanReviewCommand::class)]
final class ApprovePlanReviewTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'plans',
        'phases',
        'phase_tasks',
        'plan_review_editions',
        'tasks',
        'command_receipts',
        'number_groups',
    ];

    private Plan $plan;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->task = $this->journal->fixtures(TaskFixtures::class)->task(
            'Write',
            'Write the page.',
        )->taskCalled('Write');

        $this->plan = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release', title: 'Build the release page')
            ->phaseWithTask('Release', 'Writing', $this->task->assignmentIdentity())
            ->planCalled('Release');
    }

    public function test_approving_the_open_review_records_one_receipt_that_a_replay_returns(): void
    {
        $this->runCommand(
            new RequestPlanReviewCommand(
                $this->plan->id,
                [ActorReference::ofClass(User::class, $this->journal->ownerUser()->id)],
            ),
        );

        $key = (string) Str::uuid();

        $first = $this->journal->run(new ApprovePlanReviewCommand($this->plan->id, 1, $key), $key);
        $again = $this->journal->run(new ApprovePlanReviewCommand($this->plan->id, 1, $key), $key);

        $this->assertSame($first, $again);
        $review = PlanReviewEdition::query()->whereKey($first)->sole();
        $this->assertSame(PlanReviewStatus::Approved, $review->status);
        $this->assertSame($this->journal->ownerUser()->id, $review->decided_by_id);
        $this->assertSame(PlanStatus::Planned, $this->plan->refresh()->status);

        $this->runCommand(new StartPlanCommand($this->plan->id));
        $this->assertSame(PlanStatus::Started, $this->plan->refresh()->status);
    }

    public function test_a_decision_on_a_withdrawn_review_reports_its_outcome(): void
    {
        $this->runCommand(
            new RequestPlanReviewCommand(
                $this->plan->id,
                [ActorReference::ofClass(User::class, $this->journal->ownerUser()->id)],
            ),
        );

        $this->runCommand(new WithdrawPlanReviewCommand($this->plan->id));

        $this->assertThrows(
            fn () => $this->runCommand(new ApprovePlanReviewCommand($this->plan->id, 1, (string) Str::uuid())),
            PlanReviewRefused::class,
            PlanReviewRefused::alreadyDecided($this->plan->number, 1, PlanReviewStatus::Withdrawn->value)->getMessage(),
        );
    }

    private function runCommand(object $command): mixed
    {
        return $this->journal->run($command);
    }
}
