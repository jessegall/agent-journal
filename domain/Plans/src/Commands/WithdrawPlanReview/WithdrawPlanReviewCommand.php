<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\WithdrawPlanReview;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Withdraws a plan's review before a decision: the edition records the withdrawal and the plan is Planned again.
 *
 * @extends Command<null>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class WithdrawPlanReviewCommand extends Command
{
    public function __construct(public string $planId) {}
}
