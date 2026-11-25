<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\CreatePlan;

use App\Attributes\Commands\Authorize;
use App\Attributes\Validation\OneLine;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates a planned plan with its title, brief and type and answers its id; it records who created it.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Create)]
final readonly class CreatePlanCommand extends Command
{
    public function __construct(
        #[Required, OneLine, Max(Plan::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Required, Max(Plan::BRIEF_CHARACTER_LIMIT)]
        public string $brief,
        public PlanType $type,
    ) {}
}
