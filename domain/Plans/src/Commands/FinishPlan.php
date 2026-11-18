<?php

declare(strict_types=1);

namespace Domain\Plans\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Plans\Handlers\FinishPlanHandler;

/**
 * Finishes a started plan whose tasks are all finished or cancelled, with a note of what it achieved.
 *
 * @implements Command<null>
 */
#[HandledBy(FinishPlanHandler::class)]
final readonly class FinishPlan implements Command
{
    public function __construct(
        public string $planId,
        public int $expectedRevision,
        public string $note,
    ) {}
}
