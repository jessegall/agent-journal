<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Approves the edition of a plan's review the decider read, once it is certified as the plan's current content; the
 * plan is Planned again and starting it stays a separate action. A repeat under the same key returns the first
 * receipt.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Admin)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class ApprovePlanReview extends Command
{
    public function __construct(
        public string $planId,
        public int $editionNumber,
        public string $requestKey,
    ) {}
}
