<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\ApprovePlanReview;
use Domain\Plans\Commands\RequestPlanReview;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Commands\WithdrawPlanReview;
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
use Tests\Support\StartsAgentRequests;

/**
 * A review decision certifies its edition against the plan's current content: approving the current edition records
 * one receipt and a replay returns it; a changed member makes the decision stale; a closed edition reports its
 * outcome; starting stays a separate action.
 */
final class PlanReviewDecisionTest extends TestCase
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
        'plan_review_phases',
        'plan_review_members',
        'tasks',
        'command_receipts',
    ];

    private Plan $plan;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->plan = Plan::factory()->create(['title' => 'Build the release page']);
        $this->task = Task::factory()->create(['title' => 'Write', 'brief' => 'Write the page.']);
        $this->startUserRequestAs($this->owner->id);
        $structure = $this->app->make(PlanStructure::class);
        $structure->addTasks($structure->addPhase($this->plan, 'Writing'), [$this->task->id]);
    }

    public function test_approving_the_current_edition_records_one_receipt_that_a_replay_returns(): void
    {
        $this->runCommand(new RequestPlanReview($this->plan->id));
        $key = (string) Str::uuid();

        $first = $this->runCommand(new ApprovePlanReview($this->plan->id, 1, $key));
        $again = $this->runCommand(new ApprovePlanReview($this->plan->id, 1, $key));

        $this->assertSame($first, $again);
        $edition = PlanReviewEdition::query()->whereKey($first)->sole();
        $this->assertSame(PlanReviewState::Approved, $edition->state);
        $this->assertSame($this->owner->id, $edition->decided_by_id);
        $this->assertSame(PlanState::Planned, $this->plan->refresh()->state);

        $this->runCommand(new StartPlan($this->plan->id));
        $this->assertSame(PlanState::Started, $this->plan->refresh()->state);
    }

    public function test_a_changed_member_makes_the_decision_stale(): void
    {
        $this->runCommand(new RequestPlanReview($this->plan->id));
        $this->task->describe('Write', 'Write the new page.');

        $this->assertThrows(
            fn () => $this->runCommand(new ApprovePlanReview($this->plan->id, 1, (string) Str::uuid())),
            PlanReviewRefused::class,
        );
        $this->assertSame(PlanState::Reviewing, $this->plan->refresh()->state);
    }

    public function test_a_decision_on_a_withdrawn_edition_reports_its_outcome(): void
    {
        $this->runCommand(new RequestPlanReview($this->plan->id));
        $this->runCommand(new WithdrawPlanReview($this->plan->id));

        $this->assertThrows(
            fn () => $this->runCommand(new ApprovePlanReview($this->plan->id, 1, (string) Str::uuid())),
            PlanReviewRefused::class,
            'Edition 1 of plan '.$this->plan->number.' is already withdrawn.',
        );
    }

    private function runCommand(object $command): mixed
    {
        return $this->app->make(CommandBus::class)->run($command);
    }
}
