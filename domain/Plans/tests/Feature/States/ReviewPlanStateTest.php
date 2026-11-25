<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature\States;

use App\Enums\Hooks\AnswerType;
use App\Events\Hooks\HelperFinishedOnRecord;
use App\Events\Hooks\HelperAssigned;
use App\Support\Inputs\StopRequested;
use App\Support\RecordIdentity;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\Support\ReviewPlanStateReference;
use Domain\Plans\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
use Tests\Support\TestIds;

/**
 * The plan review state on the real engine: it holds the agent's stop while no reviewer is out, lets it pass while one
 * is, and ends once the review is decided or withdrawn.
 */
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

        $this->journal->owner()->agent('Writer');
    }

    public function test_a_review_refuses_the_stop(): void
    {
        $this->reviewing()->given(
            $this->stop(),
            fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny),
        );
    }

    public function test_with_a_reviewer_out_the_stop_passes_to_the_states_below(): void
    {
        $this->reviewing()->given(
            [
                new HelperAssigned($this->plan(), TestIds::of(7)),
                $this->stop(),
            ],
            function (StateObservation $state) {
                $state->assertStateAnswer(AnswerType::Delegate);
                $state->assertValue('reviewersOut.agentIds', [TestIds::of(7)]);
            },
        );
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

        $this->reviewing()
            ->given(
                [
                    new HelperAssigned($this->plan(), $seven),
                    new HelperAssigned($this->plan(), $eight),
                    new HelperFinishedOnRecord($this->plan(), $seven),
                ],
                fn (StateObservation $state) => $state->assertValue('reviewersOut.agentIds', [$eight]),
            )
            ->given(
                [
                    new HelperFinishedOnRecord($this->plan(), $eight),
                    $this->stop(),
                ],
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny),
            );
    }

    public function test_a_helper_on_another_record_is_not_counted(): void
    {
        $other = new RecordIdentity(Plan::linkType(), TestIds::of(6));

        $this->reviewing()->given(
            new HelperAssigned($other, TestIds::of(7)),
            fn (StateObservation $state) => $state->assertValue('reviewersOut.agentIds', []),
        );
    }

    public function test_the_review_ends_when_it_is_decided(): void
    {
        $this->reviewing()->given(
            new PlanReviewDecided(TestIds::of(5), 'edition-1', PlanReviewStatus::Approved),
            fn (StateObservation $state) => $state->assertFinished(),
        );
    }

    public function test_the_review_ends_when_it_is_withdrawn_and_not_for_another_plan(): void
    {
        $this->reviewing()
            ->given(
                new PlanReviewWithdrawn(TestIds::of(6), 'edition-1'),
                fn (StateObservation $state) => $state->assertLive(),
            )
            ->given(
                new PlanReviewWithdrawn(TestIds::of(5), 'edition-1'),
                fn (StateObservation $state) => $state->assertFinished(),
            );
    }

    private function reviewing(): StateHandle
    {
        return $this->journal->pushState(
            $this->journal->sessionOf('Writer'),
            ReviewPlanStateReference::forPlan(TestIds::of(5), 12),
        );
    }

    private function plan(): RecordIdentity
    {
        return new RecordIdentity(Plan::linkType(), TestIds::of(5));
    }

    private function stop(): StopRequested
    {
        return $this->journal->hooksFor($this->journal->sessionOf('Writer'))->stop();
    }
}
