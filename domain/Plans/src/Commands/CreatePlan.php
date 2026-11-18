<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Handlers\CreatePlanHandler;

/**
 * Creates a planned plan with its title, brief and type and answers its id; it records who created it.
 *
 * @implements Command<string>
 */
#[HandledBy(CreatePlanHandler::class)]
final readonly class CreatePlan implements Command
{
    public function __construct(
        public string $title,
        public string $brief,
        public PlanType $type,
    ) {}
}
