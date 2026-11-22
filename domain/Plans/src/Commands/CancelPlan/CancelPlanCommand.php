<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\CancelPlan;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Cancels a plan with its reason at the revision the caller read, and in the state it read when it names one; its
 * tasks and assignments keep their state.
 *
 * @extends Command<null>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class CancelPlanCommand extends Command
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        #[Required, Max(Plan::NOTE_CHARACTER_LIMIT)]
        public string $reason,
        public PlanState|null $expectedState = null,
    ) {}
}
