<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\States;

use App\Events\Hooks\HelperAssigned;
use App\Events\Hooks\HelperFinishedOnRecord;
use App\Hooks\Enums\AnswerType;
use App\Support\RecordIdentity;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\ReviewPlanState;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use Domain\Plans\Tests\TestCase;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHook;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\TestIds;

/**
 * The plan review state on the real engine: it holds the agent's stop while no reviewer is out, lets it pass while one
 * is, and ends once the review is decided or withdrawn.
 */
#[TestsState(ReviewPlanState::class)]
final class ReviewPlanStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = [
        'agent_stacks',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->pushState('Writer', $this->reviewing());
    }

    public function test_a_review_refuses_the_stop(): void
    {
        $this->journal->stateOn('Writer', $this->reviewing(), fn (StateHandle $reviewing) => $reviewing->steps(
            [SessionHook::stop()],
            fn (StateAssert $state) => $state->answers(AnswerType::Deny),
        ));
    }

    public function test_with_a_reviewer_out_the_stop_passes_to_the_states_below(): void
    {
        $this->journal->stateOn('Writer', $this->reviewing(), fn (StateHandle $reviewing) => $reviewing->steps(
            [new HelperAssigned($this->plan(), TestIds::of(7)), SessionHook::stop()],
            fn (StateAssert $state) => $state
                ->answers(AnswerType::Delegate)
                ->where('reviewersOut.agentIds', [TestIds::of(7)]),
        ));
    }

    public function test_a_report_back_removes_that_reviewer_and_the_review_holds_the_stop_again(): void
    {
        $this->journal->idleAgent(
            'Reviewer 7',
            'journal-plan-reviewer',
        )->idleAgent('Reviewer 8', 'journal-plan-reviewer');

        [$seven, $eight] = [
            $this->journal->agentCalled('Reviewer 7')->id,
            $this->journal->agentCalled('Reviewer 8')->id,
        ];

        $this->journal->stateOn('Writer', $this->reviewing(), fn (StateHandle $reviewing) => $reviewing
            ->steps(
                [
                    new HelperAssigned($this->plan(), $seven),
                    new HelperAssigned($this->plan(), $eight),
                    new HelperFinishedOnRecord($this->plan(), $seven),
                ],
                fn (StateAssert $state) => $state->where('reviewersOut.agentIds', [$eight]),
            )
            ->steps(
                [new HelperFinishedOnRecord($this->plan(), $eight), SessionHook::stop()],
                fn (StateAssert $state) => $state->answers(AnswerType::Deny),
            ));
    }

    public function test_a_helper_on_another_record_is_not_counted(): void
    {
        $other = new RecordIdentity(Plan::linkType(), TestIds::of(6));

        $this->journal->stateOn('Writer', $this->reviewing(), fn (StateHandle $reviewing) => $reviewing->event(
            new HelperAssigned($other, TestIds::of(7)),
            fn (StateAssert $state) => $state->where('reviewersOut.agentIds', []),
        ));
    }

    public function test_the_review_ends_when_it_is_decided(): void
    {
        $this->journal->stateOn('Writer', $this->reviewing(), fn (StateHandle $reviewing) => $reviewing->event(
            new PlanReviewDecided(TestIds::of(5), 'edition-1', PlanReviewStatus::Approved),
            fn (StateAssert $state) => $state->isFinished(),
        ));
    }

    public function test_the_review_ends_when_it_is_withdrawn_and_not_for_another_plan(): void
    {
        $this->journal->stateOn('Writer', $this->reviewing(), fn (StateHandle $reviewing) => $reviewing
            ->event(
                new PlanReviewWithdrawn(TestIds::of(6), 'edition-1'),
                fn (StateAssert $state) => $state->isLive(),
            )
            ->event(
                new PlanReviewWithdrawn(TestIds::of(5), 'edition-1'),
                fn (StateAssert $state) => $state->isFinished(),
            ));
    }

    private function reviewing(): ReviewPlanStateReference
    {
        return ReviewPlanStateReference::forPlan(TestIds::of(5), 12);
    }

    private function plan(): RecordIdentity
    {
        return new RecordIdentity(Plan::linkType(), TestIds::of(5));
    }
}
