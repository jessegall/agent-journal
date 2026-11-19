<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\FinishTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Finishes the caller's current run of a task with a result note; the task's work ends on every stack.
 *
 * @extends Command<null>
 */
#[HandledBy(FinishTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Finish)]
final readonly class FinishTask extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        public string $note,
    ) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
