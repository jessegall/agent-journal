<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Handlers\CreatePlanHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;

/**
 * Creates a planned plan with its title, brief and type and answers its id; it records who created it.
 *
 * @implements Command<string>
 */
#[HandledBy(CreatePlanHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class CreatePlan implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $title,
        public string $brief,
        public PlanType $type,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
