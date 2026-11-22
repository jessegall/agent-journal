<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Makes a task wait on another: it is not ready until the other is finished or the wait is waived.
 *
 * @extends Command<string>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
final readonly class AddTaskWait extends Command implements RecordCommand
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
    ) {}

    public function subject(): Task
    {
        return Task::ofId($this->dependentTaskId);
    }
}
