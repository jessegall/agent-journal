<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\BlockTaskHandler;

/**
 * Blocks a task until what it waits on arrives.
 *
 * @implements Command<null>
 */
#[HandledBy(BlockTaskHandler::class)]
final readonly class BlockTask implements Command
{
    public function __construct(
        public int $taskId,
    ) {}
}
