<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\EditPlan;

use App\Attributes\Commands\Authorize;
use App\Attributes\Validation\OneLine;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Gives a plan a new title, brief or type, refused when the plan moved past the revision the caller read; answers
 * the new revision. What is left out stays as it is.
 *
 * @extends Command<int>
 */
#[Authorize(PlanPolicy::class, AccessType::Edit)]
final readonly class EditPlanCommand extends Command
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        #[OneLine, Max(Plan::TITLE_CHARACTER_LIMIT)]
        public string|null $title = null,
        #[Max(Plan::BRIEF_CHARACTER_LIMIT)]
        public string|null $brief = null,
        public PlanType|null $type = null,
    ) {}
}
