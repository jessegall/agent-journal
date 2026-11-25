<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\AddPhase;

use App\Attributes\Commands\Authorize;
use App\Attributes\Validation\OneLine;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Adds a phase after the plan's last one and answers its id; the phase takes the plan's next phase number.
 *
 * @extends Command<string>
 */
#[Authorize(PlanPolicy::class, AccessType::Create)]
final readonly class AddPhaseCommand extends Command
{
    public function __construct(
        public string $planId,
        #[Required, OneLine, Max(Plan::TITLE_CHARACTER_LIMIT)]
        public string $title,
    ) {}
}
