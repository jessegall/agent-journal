<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\States;

use App\Enums\Hooks\AnswerType;
use App\Events\Hooks\HelperReportedOnRecord;
use App\Events\Hooks\HelperSentOnRecord;
use App\Models\Agents\Agent;
use App\Support\RecordIdentity;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use Domain\Plans\Tests\TestCase;
use Tests\Support\StateScenario;
use Tests\Support\TestIds;
use Tests\Support\TestsStates;

/**
 * The plan review state on the real engine: it holds the agent's stop while no reviewer is out, lets it pass while one
 * is, and ends once the review is decided or withdrawn.
 */
final class ReviewPlanStateTest extends TestCase
{
    use TestsStates;

    public function test_a_review_refuses_the_stop(): void
    {
        $this->assertSame(AnswerType::Deny, $this->reviewing()->given($this->stop())->lastStateAnswer());
    }

    public function test_with_a_reviewer_out_the_stop_passes_to_the_states_below(): void
    {
        $scenario = $this->reviewing()->given(new HelperSentOnRecord($this->plan(), TestIds::of(7)), $this->stop());

        $this->assertSame(AnswerType::Delegate, $scenario->lastStateAnswer());
        $this->assertSame([TestIds::of(7)], $scenario->values()['reviewersOut']['agentIds']);
    }

    public function test_a_report_back_removes_that_reviewer_and_the_review_holds_the_stop_again(): void
    {
        $this->helper(7);
        $this->helper(8);

        $scenario = $this->reviewing()->given(
            new HelperSentOnRecord($this->plan(), TestIds::of(7)),
            new HelperSentOnRecord($this->plan(), TestIds::of(8)),
            new HelperReportedOnRecord($this->plan(), TestIds::of(7)),
        );

        $this->assertSame([TestIds::of(8)], $scenario->values()['reviewersOut']['agentIds']);

        $scenario->given(new HelperReportedOnRecord($this->plan(), TestIds::of(8)), $this->stop());

        $this->assertSame(AnswerType::Deny, $scenario->lastStateAnswer());
    }

    public function test_a_helper_on_another_record_is_not_counted(): void
    {
        $other = new RecordIdentity(Plan::linkType(), TestIds::of(6));

        $scenario = $this->reviewing()->given(new HelperSentOnRecord($other, TestIds::of(7)));

        $this->assertSame([], $scenario->values()['reviewersOut']['agentIds']);
    }

    public function test_the_review_ends_when_it_is_decided(): void
    {
        $this->reviewing()
            ->given(new PlanReviewDecided(TestIds::of(5), 'edition-1', PlanReviewState::Approved))
            ->assertPopped();
    }

    public function test_the_review_ends_when_it_is_withdrawn_and_not_for_another_plan(): void
    {
        $this->reviewing()
            ->given(new PlanReviewWithdrawn(TestIds::of(6), 'edition-1'))
            ->assertStillActive()
            ->given(new PlanReviewWithdrawn(TestIds::of(5), 'edition-1'))
            ->assertPopped();
    }

    private function reviewing(): StateScenario
    {
        return $this->scenario(ReviewPlanStateReference::forPlan(TestIds::of(5), 12));
    }

    /**
     * A helper agent the review sent out, whose report back is recorded by its name.
     */
    private function helper(int $number): void
    {
        $agent = new Agent()->forceFill([
            'name' => "Reviewer {$number}",
            'profile_key' => 'journal-plan-reviewer',
        ]);
        $agent->id = TestIds::of($number);
        $agent->save();
    }

    private function plan(): RecordIdentity
    {
        return new RecordIdentity(Plan::linkType(), TestIds::of(5));
    }
}
