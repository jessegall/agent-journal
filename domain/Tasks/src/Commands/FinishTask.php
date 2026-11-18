<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\FinishTaskHandler;

/**
 * Finishes a task; a finished task finished again saves and is announced again.
 *
 * @implements Command<null>
 */
#[HandledBy(FinishTaskHandler::class)]
final readonly class FinishTask implements Command
{
    public function __construct(
        public string $taskId,
    ) {}
}
