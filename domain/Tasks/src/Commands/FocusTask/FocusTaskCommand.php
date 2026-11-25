<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\FocusTask;

use App\Attributes\Authorize;
use App\Contracts\Bus\RecordCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskRunPolicy;

/**
 * Puts one of the caller's started tasks in its focus, the task it works on now, taking the focus from any other, and
 * brings the task's work back on top of the caller's stack.
 *
 * @extends Command<null>
 */
#[Authorize(TaskRunPolicy::class, AccessType::Edit)]
final readonly class FocusTaskCommand extends Command implements RecordCommand
{
    public function __construct(public string $taskId) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
