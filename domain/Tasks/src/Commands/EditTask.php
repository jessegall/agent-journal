<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use Domain\Tasks\Handlers\EditTaskHandler;

/**
 * Gives a task a new title, brief or both, refused when the task moved past the revision the caller read; answers the
 * new revision. A title or brief left out stays as it is.
 *
 * @implements Command<int>
 */
#[HandledBy(EditTaskHandler::class)]
final readonly class EditTask implements Command
{
    public function __construct(
        public string $taskId,
        public int $expectedRevision,
        public string|null $title = null,
        public string|null $brief = null,
    ) {}
}
