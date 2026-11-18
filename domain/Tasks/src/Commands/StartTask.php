<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\StartTaskHandler;

/**
 * Starts a task for the agent of a session and answers its run number; the start and the push of its state commit
 * together.
 *
 * @implements Command<int>
 */
#[HandledBy(StartTaskHandler::class)]
final readonly class StartTask implements Command
{
    public function __construct(
        public string $taskId,
        public string $sessionId,
    ) {}
}
