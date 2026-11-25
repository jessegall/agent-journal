<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use Domain\Plans\Commands\RequestPlanChanges\RequestPlanChangesCommand;
use Domain\Plans\Commands\RequestPlanReview\RequestPlanReviewCommand;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Exceptions\PlanReviewRefused;
use Domain\Plans\Models\Plan;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;

/**
 * A reviewer asks for changes to the open review of a plan with a reason: the review keeps the decision and reason,
 * and the plan is planned again; an empty reason is refused, and a review already decided is refused with its outcome.
 */
final class RequestPlanChangesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['plans', 'plan_review_editions', 'command_receipts', 'number_groups'];

    private Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->plan = $this->journal->fixtures(PlanFixtures::class)
            ->plan('Release', 'Ship it.', PlanType::Build)
            ->planCalled('Release');

        $this->journal->run(new RequestPlanReviewCommand($this->plan->id, [$this->journal->actorCalled('Owner')]));
    }

    public function test_changes_asked_for_keep_the_reason_and_plan_the_plan_again(): void
    {
        $key = (string) Str::uuid();

        $reviewId = $this->journal->run(
            new RequestPlanChangesCommand($this->plan->id, 1, $key, 'Split the second phase.'),
            $key,
        );

        $review = PlanReviewEdition::query()->findOrFail($reviewId);

        $this->assertSame(
            [PlanReviewStatus::ChangesRequested, 'Split the second phase.', PlanStatus::Planned],
            [$review->status, $review->decision_reason, $this->plan->refresh()->status],
        );
    }

    public function test_an_empty_reason_and_a_decided_review_are_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new RequestPlanChangesCommand($this->plan->id, 1, (string) Str::uuid(), '')),
            CommandInputInvalid::class,
            'reason:',
        );

        $key = (string) Str::uuid();
        $this->journal->run(new RequestPlanChangesCommand($this->plan->id, 1, $key, 'Split it.'), $key);

        $this->assertThrows(
            fn () => $this->journal->run(
                new RequestPlanChangesCommand($this->plan->id, 1, (string) Str::uuid(), 'Again.'),
            ),
            PlanReviewRefused::class,
        );
    }
}
