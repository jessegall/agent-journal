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
use Domain\Plans\Handlers\EditPlanHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Gives a plan a new title, brief or type, refused when the plan moved past the revision the caller read; answers
 * the new revision. What is left out stays as it is.
 *
 * @extends Command<int>
 */
#[HandledBy(EditPlanHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
final readonly class EditPlan extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        #[OneLine, Max(Plan::TITLE_CHARACTERS)]
        public string|null $title = null,
        #[Max(Plan::BRIEF_CHARACTERS)]
        public string|null $brief = null,
        public PlanType|null $type = null,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Plan::class;
    }
}
