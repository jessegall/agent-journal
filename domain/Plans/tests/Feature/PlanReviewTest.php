<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\RequestPlanReview;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Commands\WithdrawPlanReview;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Models\PlanReviewMember;
use Domain\Plans\Models\PlanReviewPhase;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * Requesting review freezes the plan's headings, members and briefs as an edition that later edits never change; the
 * plan reads Reviewing and cannot start until the review is withdrawn or decided.
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
        'plan_review_phases',
        'plan_review_members',
        'tasks',
        'command_receipts',
    ];

    public function test_a_requested_review_freezes_the_content_and_a_withdrawal_returns_the_plan_to_planned(): void
    {
        $plan = Plan::factory()->create(['title' => 'Build the release page']);
        $read = Task::factory()->create(['title' => 'Read', 'brief' => 'Read the notes.']);
        $write = Task::factory()->create(['title' => 'Write', 'brief' => 'Write the page.']);
        $this->startUserRequestAs($this->owner->id);
        $structure = $this->app->make(PlanStructure::class);
        $structure->addTasks($structure->addPhase($plan, 'Reading'), [$read->id]);
        $structure->addTasks($structure->addPhase($plan, 'Writing'), [$write->id]);

        $editionId = $this->runCommand(new RequestPlanReview($plan->id));

        $this->assertSame(PlanState::Reviewing, $plan->refresh()->state);
        $this->assertSame(['Reading', 'Writing'], PlanReviewPhase::pageOf($editionId, 0, 10)->pluck('title')->all());
        $this->assertSame(['Read the notes.'], PlanReviewMember::pageOf($editionId, 1, 0, 10)->pluck('brief')->all());
        $this->assertSame(64, strlen((string) PlanReviewEdition::query()->whereKey($editionId)->value('fingerprint')));
        $this->assertThrows(fn () => $this->runCommand(new StartPlan($plan->id)));

        $read->describe('Read', 'Read the new notes.');
        $this->assertSame(['Read the notes.'], PlanReviewMember::pageOf($editionId, 1, 0, 10)->pluck('brief')->all());

        $this->runCommand(new WithdrawPlanReview($plan->id));

        $this->assertSame(PlanState::Planned, $plan->refresh()->state);
        $edition = PlanReviewEdition::query()->whereKey($editionId)->sole();
        $this->assertSame(PlanReviewState::Withdrawn, $edition->state);
        $this->assertSame($this->owner->id, $edition->decided_by_id);
    }

    public function test_a_caller_with_no_actor_is_refused(): void
    {
        $plan = Plan::factory()->create();
        $this->app->make(CurrentActorSetter::class)->clear();

        $this->assertThrows(fn () => $this->runCommand(new RequestPlanReview($plan->id)));
        $this->assertSame(PlanState::Planned, $plan->refresh()->state);
        $this->assertSame(0, PlanReviewEdition::query()->count());
    }

    private function runCommand(object $command): mixed
    {
        return $this->app->make(CommandBus::class)->run($command);
    }
}
