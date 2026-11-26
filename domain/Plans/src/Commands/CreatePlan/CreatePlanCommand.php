<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\CreatePlan;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Attributes\Validation\OneLine;
use App\Projects\Contracts\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates a planned plan of a project with its title, brief and type and answers its id; it records who created it.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Create)]
final readonly class CreatePlanCommand extends Command implements ProjectCommand
{
    public function __construct(
        #[Required, OneLine, Max(Plan::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Required, Max(Plan::BRIEF_CHARACTER_LIMIT)]
        public string $brief,
        public PlanType $type,
        public string $projectId,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
