<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Handlers\StartPlanHandler;

/**
 * Starts a plan for the actor of this request, a user or an agent alike; starting a started plan changes nothing.
 *
 * @implements Command<null>
 */
#[HandledBy(StartPlanHandler::class)]
final readonly class StartPlan implements Command
{
    public function __construct(
        public int $planId,
    ) {}
}
