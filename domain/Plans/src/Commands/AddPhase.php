<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\AddPhaseHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Adds a phase after the plan's last one and answers its id; the phase takes the plan's next phase number.
 *
 * @extends Command<string>
 */
#[HandledBy(AddPhaseHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class AddPhase extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $planId,
        public string $title,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
