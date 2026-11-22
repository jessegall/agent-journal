<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Unit\States;

use App\Hooks\Decisions\Denied;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\Values\HookIdentity;
use App\Hooks\Inputs\Values\StopDetails;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\States\ReviewingPlanState;
use Domain\Plans\Support\PlanWork;
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

        $decision = $state->onStop(new StopRequested(
            new HookIdentity(TestIds::of(1), TestIds::of(2), 'hook-1', 'digest'),
            new StopDetails('turn-1', false),
        ));

        $this->assertInstanceOf(Denied::class, $decision->answer);

        $this->assertSame(
            'Plan 12 waits for your review. Read it, then approve it or ask for changes.',
            $decision->refusalReason(),
        );

        $this->assertSame($decision->refusalReason(), $state->instructionText());
        $this->assertSame('plans.review', $state->instructionType());
        $this->assertFalse($state->isFinished());
    }

    #[DataProvider('statesAfterReview')]
    public function test_the_state_is_finished_once_the_plan_is_no_longer_under_review(PlanState $after): void
    {
        $this->assertTrue($this->reviewing($after)->isFinished());
    }

    private function reviewing(PlanState $state): ReviewingPlanState
    {
        return new ReviewingPlanState(new PlanWork(TestIds::of(5), 12, $state));
    }
}
