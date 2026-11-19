<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\StartTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Starts a task for the agent of a session and answers its run number; the start and the push of its state commit
 * together.
 *
 * @extends Command<int>
 */
#[HandledBy(StartTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Start)]
final readonly class StartTask extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $taskId,
    ) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
