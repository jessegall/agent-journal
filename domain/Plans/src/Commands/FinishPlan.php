<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\FinishPlanHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Finishes a started plan whose tasks are all finished or cancelled, with a note of what it achieved.
 *
 * @extends Command<null>
 */
#[HandledBy(FinishPlanHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class FinishPlan extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        #[Required, Max(Plan::NOTE_CHARACTERS)] public string $note,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
