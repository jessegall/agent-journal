<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Withdraws a plan's review before a decision: the edition records the withdrawal and the plan is Planned again.
 *
 * @extends Command<null>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class WithdrawPlanReview extends Command
{
    public function __construct(public string $planId) {}
}
