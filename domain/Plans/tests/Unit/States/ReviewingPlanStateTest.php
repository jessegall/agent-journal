<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Unit\States;

use App\Events\HelperReportedOnRecord;
use App\Events\HelperSentOnRecord;
use App\Support\Decisions\Decision;
use App\Support\Decisions\Denied;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\RecordIdentity;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanWork;
use Domain\Plans\Support\States\ReviewingPlanState;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Support\TestIds;

/**
 * Users 15883 and 15889: the reviewer's state nudges it to review and holds its stop until the review is decided or
 * withdrawn.
 */
final class ReviewingPlanStateTest extends TestCase
{
    /**
     * @return iterable<string, array{PlanState}>
     */
    public static function statesAfterReview(): iterable
    {
        yield 'decided or withdrawn' => [PlanState::Planned];

        yield 'started' => [PlanState::Started];

        yield 'cancelled' => [PlanState::Cancelled];
    }

    public function test_a_review_refuses_the_stop_with_its_instruction(): void
    {
        $state = $this->reviewing(PlanState::Reviewing);

        $decision = $state->onStop($this->stop());

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertSame($state->instruction()->get(), $decision->refusalReason());
        $this->assertFalse($state->isFinished());
    }

    public function test_with_a_reviewer_out_the_stop_passes_to_the_states_below(): void
    {
        $state = $this->reviewing(PlanState::Reviewing);

        $state->onHelperSentOnRecord(new HelperSentOnRecord($this->plan(), TestIds::of(7)));

        $this->assertEquals(Decision::delegate(), $state->onStop($this->stop()));
        $this->assertSame([TestIds::of(7)], $state->ownValues()->agentIds);
    }

    public function test_a_report_back_removes_that_reviewer_and_the_review_holds_the_stop_again(): void
    {
        $state = $this->reviewing(PlanState::Reviewing);
        $state->onHelperSentOnRecord(new HelperSentOnRecord($this->plan(), TestIds::of(7)));
        $state->onHelperSentOnRecord(new HelperSentOnRecord($this->plan(), TestIds::of(8)));

        $state->onHelperReportedOnRecord(new HelperReportedOnRecord($this->plan(), TestIds::of(7)));
        $this->assertSame([TestIds::of(8)], $state->ownValues()->agentIds);

        $state->onHelperReportedOnRecord(new HelperReportedOnRecord($this->plan(), TestIds::of(8)));
        $this->assertInstanceOf(Denied::class, $state->onStop($this->stop())?->answer);
    }

    public function test_a_helper_on_another_record_is_not_counted(): void
    {
        $state = $this->reviewing(PlanState::Reviewing);

        $state->onHelperSentOnRecord(
            new HelperSentOnRecord(new RecordIdentity(Plan::LINK_TYPE, TestIds::of(6)), TestIds::of(7)),
        );

        $this->assertSame([], $state->ownValues()->agentIds);
    }

    #[DataProvider('statesAfterReview')]
    public function test_the_state_is_finished_once_the_plan_is_no_longer_under_review(PlanState $after): void
    {
        $this->assertTrue($this->reviewing($after)->isFinished());
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
        return new RecordIdentity(Plan::LINK_TYPE, TestIds::of(5));
    }

    private function reviewing(PlanState $state): ReviewingPlanState
    {
        return new ReviewingPlanState(new PlanWork(TestIds::of(5), 12, $state));
    }
}
