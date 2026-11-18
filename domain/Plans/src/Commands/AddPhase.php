<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Handlers\AddPhaseHandler;

/**
 * Adds a phase after the plan's last one and answers its id; the phase takes the plan's next phase number.
 *
 * @implements Command<string>
 */
#[HandledBy(AddPhaseHandler::class)]
final readonly class AddPhase implements Command
{
    public function __construct(
        public string $planId,
        public string $title,
    ) {}
}
