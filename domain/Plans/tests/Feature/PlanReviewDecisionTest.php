<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Enums\Assignments\ActorType;
use App\Support\ActorIdentity;
use Domain\Plans\Commands\ApprovePlanReview\ApprovePlanReviewCommand;
use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Commands\WithdrawPlanReview\WithdrawPlanReviewCommand;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;

/**
 * A review decision: approving the open review records one receipt and a replay returns it; a closed review reports
 * its outcome; starting stays a separate action. The plan cannot change while it is under review (PlanReviewTest).
 */
final class PlanReviewDecisionTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use RunsKeyedCommands;
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

    private Plan $plan;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->plan = Plan::factory()->create(['title' => 'Build the release page']);
        $this->task = Task::factory()->create([
            'title' => 'Write',
            'brief' => 'Write the page.',
        ]);
        $this->startUserRequestAs($this->owner->id);
        $structure = $this->app->make(PlanStructure::class);
        $structure->addTasks($structure->addPhase($this->plan, 'Writing'), [$this->task->id]);
    }

    public function test_approving_the_open_review_records_one_receipt_that_a_replay_returns(): void
    {
        $this->runCommand(
            new RequestPlanReviewCommand($this->plan->id, [new ActorIdentity(ActorType::User, $this->owner->id)]),
        );

        $key = (string) Str::uuid();

        $first = $this->runOnBus(new ApprovePlanReviewCommand($this->plan->id, 1, $key), $key);
        $again = $this->runOnBus(new ApprovePlanReviewCommand($this->plan->id, 1, $key), $key);

        $this->assertSame($first, $again);
        $review = PlanReviewEdition::query()->whereKey($first)->sole();
        $this->assertSame(PlanReviewState::Approved, $review->state);
        $this->assertSame($this->owner->id, $review->decided_by_id);
        $this->assertSame(PlanState::Planned, $this->plan->refresh()->state);

        $this->runCommand(new StartPlanCommand($this->plan->id));
        $this->assertSame(PlanState::Started, $this->plan->refresh()->state);
    }

    public function test_a_decision_on_a_withdrawn_review_reports_its_outcome(): void
    {
        $this->runCommand(
            new RequestPlanReviewCommand($this->plan->id, [new ActorIdentity(ActorType::User, $this->owner->id)]),
        );

        $this->runCommand(new WithdrawPlanReviewCommand($this->plan->id));

        $this->assertThrows(
            fn () => $this->runCommand(new ApprovePlanReviewCommand($this->plan->id, 1, (string) Str::uuid())),
            PlanReviewRefused::class,
            PlanReviewRefused::alreadyDecided($this->plan->number, 1, PlanReviewState::Withdrawn->value)->getMessage(),
        );
    }

    private function runCommand(object $command): mixed
    {
        return $this->runOnBus($command);
    }
}
