<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\FinishPlan;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Finishes a started plan whose tasks are all finished or cancelled, with a note of what it achieved.
 *
 * @extends Command<null>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class FinishPlanCommand extends Command
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        #[Required, Max(Plan::NOTE_CHARACTER_LIMIT)]
        public string $note,
    ) {}
}
