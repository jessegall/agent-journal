<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Sequences\Handlers\StartSequenceHandler;

/**
 * Starts an existing sequence run for the agent of a session; the start and its state commit together.
 *
 * @implements Command<null>
 */
#[HandledBy(StartSequenceHandler::class)]
final readonly class StartSequence implements Command
{
    public function __construct(
        public int $sequenceRunId,
        public int $sessionId,
    ) {}
}
