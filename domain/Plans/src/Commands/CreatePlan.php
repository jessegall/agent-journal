<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\OneLine;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Handlers\CreatePlanHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates a planned plan with its title, brief and type and answers its id; it records who created it.
 *
 * @extends Command<string>
 */
#[HandledBy(CreatePlanHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class CreatePlan extends Command implements HasAuthorizationSubject
{
    public function __construct(
        #[Required, OneLine, Max(Plan::TITLE_CHARACTERS)]
        public string $title,
        #[Required, Max(Plan::BRIEF_CHARACTERS)]
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
