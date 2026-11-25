<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Unit\States;

use App\Events\Hooks\HelperReportedOnRecord;
use App\Events\Hooks\HelperSentOnRecord;
use App\Support\Decisions\Decision;
use App\Support\Decisions\Denied;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\RecordIdentity;
use App\Support\StateLoading\StateValues;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\States\ReviewingPlanState;
use Tests\Support\TestIds;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * The reviewer's state nudges it to review and holds its stop until the review is decided or
 * withdrawn.
 */
final class ReviewingPlanStateTest extends TestCase
{
    public function test_a_review_refuses_the_stop_with_its_instruction(): void
    {
        $state = $this->reviewing();

        $decision = $state->onStop($this->stop());

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertSame(TestText::words($state->instruction()->get()), TestText::words($decision->refusalReason()));
        $this->assertFalse($state->isFinished());
    }

    public function test_with_a_reviewer_out_the_stop_passes_to_the_states_below(): void
    {
        $state = $this->reviewing();

        $state->onHelperSentOnRecord(new HelperSentOnRecord($this->plan(), TestIds::of(7)));

        $this->assertEquals(Decision::delegate(), $state->onStop($this->stop()));
        $this->assertSame([TestIds::of(7)], $this->reviewersOf($state));
    }

    public function test_a_report_back_removes_that_reviewer_and_the_review_holds_the_stop_again(): void
    {
        $state = $this->reviewing();
        $state->onHelperSentOnRecord(new HelperSentOnRecord($this->plan(), TestIds::of(7)));
        $state->onHelperSentOnRecord(new HelperSentOnRecord($this->plan(), TestIds::of(8)));

        $state->onHelperReportedOnRecord(new HelperReportedOnRecord($this->plan(), TestIds::of(7)));
        $this->assertSame([TestIds::of(8)], $this->reviewersOf($state));

        $state->onHelperReportedOnRecord(new HelperReportedOnRecord($this->plan(), TestIds::of(8)));
        $this->assertInstanceOf(Denied::class, $state->onStop($this->stop())->answer);
    }

    public function test_a_helper_on_another_record_is_not_counted(): void
    {
        $state = $this->reviewing();

        $state->onHelperSentOnRecord(
            new HelperSentOnRecord(new RecordIdentity(Plan::linkType(), TestIds::of(6)), TestIds::of(7)),
        );

        $this->assertSame([], $this->reviewersOf($state));
    }

    public function test_the_review_ends_when_the_state_hears_it_decided_or_withdrawn(): void
    {
        $decided = $this->reviewing();
        $decided->onPlanReviewDecided(new PlanReviewDecided(TestIds::of(5), 'edition-1', PlanReviewState::Approved));
        $withdrawn = $this->reviewing();
        $withdrawn->onPlanReviewWithdrawn(new PlanReviewWithdrawn(TestIds::of(5), 'edition-1'));
        $other = $this->reviewing();
        $other->onPlanReviewWithdrawn(new PlanReviewWithdrawn(TestIds::of(6), 'edition-1'));

        $this->assertTrue($decided->isFinished());
        $this->assertTrue($withdrawn->isFinished());
        $this->assertFalse($other->isFinished());
    }

    private function stop(): StopRequested
    {
        return new StopRequested(
            new HookIdentity(TestIds::of(1), TestIds::of(2), 'hook-1', 'digest'),
            new StopDetails('turn-1', false, ''),
        );
    }

    private function plan(): RecordIdentity
    {
        return new RecordIdentity(Plan::linkType(), TestIds::of(5));
    }

    private function reviewing(): ReviewingPlanState
    {
        return new ReviewingPlanState(TestIds::of(5), 12);
    }

    /**
     * @return list<string>
     */
    private function reviewersOf(ReviewingPlanState $state): array
    {
        return StateValues::of($state)['reviewersOut']['agentIds'];
    }
}
