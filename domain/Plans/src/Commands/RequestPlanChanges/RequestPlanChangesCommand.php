<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\RequestPlanChanges;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;

/**
 * Sends the edition of a plan's review the decider read back with the changes asked for; the plan is Planned again
 * with the note. A repeat under the same key returns the first receipt.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Admin)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RequestPlanChangesCommand extends Command
{
    public function __construct(
        public string $planId,
        public int $editionNumber,
        public string $requestKey,
        #[Min(1), Max(Plan::NOTE_CHARACTER_LIMIT)]
        public string $reason,
    ) {}
}
