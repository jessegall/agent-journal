<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Commands\WithdrawPlanReview\WithdrawPlanReviewCommand;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * Whoever asked for a review withdraws it: the review is kept as withdrawn by them and the plan is planned again; a
 * plan with no review open is refused.
 */
final class WithdrawPlanReviewTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'plans',
        'plan_review_editions',
        'command_receipts',
        'number_groups',
    ];

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->plan = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release', 'Ship it.', PlanType::Build)
            ->planCalled('Release');
    }

    public function test_a_withdrawn_review_is_kept_as_withdrawn_and_the_plan_is_planned_again(): void
    {
        $reviewId = $this->journal->run(
            new RequestPlanReviewCommand($this->plan->id, [$this->journal->actorCalled('Owner')]),
        );

        $this->journal->run(new WithdrawPlanReviewCommand($this->plan->id));

        $review = PlanReviewEdition::query()->findOrFail($reviewId);

        $this->assertSame(
            [
                PlanReviewStatus::Withdrawn,
                $this->journal->ownerUser()->id,
                PlanStatus::Planned,
            ],
            [
                $review->status,
                $review->decided_by_id,
                $this->plan->refresh()->status,
            ],
        );
    }

    public function test_a_plan_with_no_review_open_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new WithdrawPlanReviewCommand($this->plan->id)),
            PlanReviewRefused::class,
            PlanReviewRefused::notReviewing($this->plan->number, PlanStatus::Planned->value)->getMessage(),
        );
    }
}
