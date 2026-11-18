<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\CancelTaskHandler;

/**
 * Cancels a task, so it is no longer worked.
 *
 * @implements Command<null>
 */
#[HandledBy(CancelTaskHandler::class)]
final readonly class CancelTask implements Command
{
    public function __construct(
        public int $taskId,
    ) {}
}
