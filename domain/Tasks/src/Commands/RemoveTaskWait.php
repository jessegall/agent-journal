<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Removes a task's wait on another; the wait's history keeps that it was there.
 *
 * @extends Command<null>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RemoveTaskWait extends Command implements RecordCommand
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
        public string $requestKey,
    ) {}

    public function subject(): Task
    {
        return Task::ofId($this->dependentTaskId);
    }
}
