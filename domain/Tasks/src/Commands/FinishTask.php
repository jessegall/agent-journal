<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\FinishTaskHandler;

/**
 * Finishes the caller's current run of a task with a result note; the task's work ends on every stack.
 *
 * @implements Command<null>
 */
#[HandledBy(FinishTaskHandler::class)]
final readonly class FinishTask implements Command
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        public string $note,
    ) {}
}
