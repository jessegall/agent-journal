<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\CancelTaskHandler;

/**
 * Cancels a task with a reason: the user or a main agent any task, another agent only its own run.
 *
 * @implements Command<null>
 */
#[HandledBy(CancelTaskHandler::class)]
final readonly class CancelTask implements Command
{
    public function __construct(
        public string $taskId,
        public string $reason,
    ) {}
}
