<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Models\Agents\AgentSession;
use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\StateObservation;

/**
 * Each agent named to review a plan gets the review on its stack once the request commits; a
 * user named as reviewer works on no stack and gets nothing.
 */
final class PlanReviewStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'plan_review_editions',
        'plans',
        'phases',
        'phase_tasks',
        'agent_stacks',
        'command_receipts',
    ];

    private const string PLAN = 'Release';

    private PlanFixtures $plans;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Reviewer')->user('Ada');
        $this->plans = $this->journal->fixtures(PlanFixtures::class)->plan(self::PLAN);
    }

    public function test_an_agent_named_as_reviewer_gets_the_review_on_its_stack(): void
    {
        $plan = $this->plans->planCalled(self::PLAN);

        $this->journal->actAs('Owner')->run(new RequestPlanReviewCommand($plan->id, [
            $this->journal->actorCalled('Reviewer'),
            $this->journal->actorCalled('Ada'),
        ]));

        $this->journal->stateOn($this->reviewer(), ReviewPlanStateReference::forPlan($plan->id, $plan->number))
            ->given([], fn (StateObservation $state) => $state->assertOnTop());
    }

    public function test_a_review_with_only_a_user_as_reviewer_changes_no_stack(): void
    {
        $plan = $this->plans->planCalled(self::PLAN);

        $this->journal->actAs('Owner')->run(
            new RequestPlanReviewCommand($plan->id, [$this->journal->actorCalled('Ada')]),
        );

        $this->journal->assertNoFrame($this->reviewer(), ReviewPlanStateReference::forPlan($plan->id, $plan->number));
    }

    private function reviewer(): AgentSession
    {
        return $this->journal->sessionOf('Reviewer');
    }
}
