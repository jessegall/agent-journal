<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\CancelPlanHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Cancels a plan with its reason; its tasks and assignments stay.
 *
 * @extends Command<null>
 */
#[HandledBy(CancelPlanHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
#[Operation('cancel_plan', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class CancelPlan extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        #[Required, Max(Plan::NOTE_CHARACTER_LIMIT)]
        public string $reason,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
