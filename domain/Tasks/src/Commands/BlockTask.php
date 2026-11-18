<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\BlockTaskHandler;

/**
 * Blocks the caller's current run of a task with the reason it waits; the task's work ends on every stack.
 *
 * @implements Command<null>
 */
#[HandledBy(BlockTaskHandler::class)]
final readonly class BlockTask implements Command
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        public string $reason,
    ) {}
}
