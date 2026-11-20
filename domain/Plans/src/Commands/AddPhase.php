<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\OneLine;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Plans\Enums\PlanAbility;
use Domain\Plans\Handlers\AddPhaseHandler;
use Domain\Plans\Models\Plan;
use Domain\Plans\Policies\PlanPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Adds a phase after the plan's last one and answers its id; the phase takes the plan's next phase number.
 *
 * @extends Command<string>
 */
#[HandledBy(AddPhaseHandler::class)]
#[Authorize(PlanPolicy::class, PlanAbility::Work)]
#[Operation('add_phase', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class AddPhase extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $planId,
        #[Required, OneLine, Max(Plan::TITLE_CHARACTERS)]
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
