<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\CancelTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Cancels a task with a reason: the user or a main agent any task, another agent only its own run.
 *
 * @extends Command<null>
 */
#[HandledBy(CancelTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Cancel)]
final readonly class CancelTask extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $taskId,
        public string $reason,
    ) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
