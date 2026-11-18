<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\StartTaskHandler;

/**
 * Starts a task for the agent of a session; the start and the push of its state commit together.
 *
 * @implements Command<null>
 */
#[HandledBy(StartTaskHandler::class)]
final readonly class StartTask implements Command
{
    public function __construct(
        public int $taskId,
        public int $sessionId,
    ) {}
}
