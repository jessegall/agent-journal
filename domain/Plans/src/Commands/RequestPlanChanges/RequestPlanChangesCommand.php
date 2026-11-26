<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\RequestPlanChanges;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Commands\RequiresRequestKey;
use App\Support\Command;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Sends the edition of a plan's review the decider read back with the changes asked for; the plan is Planned again
 * with the note. A repeat under the same key returns the first receipt.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Admin)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class RequestPlanChangesCommand extends Command
{
    public function __construct(
        public string $planId,
        public int $editionNumber,
        public string $requestKey,
        #[Required, Max(Plan::NOTE_CHARACTER_LIMIT)]
        public string $reason,
    ) {}
}
