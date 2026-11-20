<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\ResumeTaskRunHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Takes up an unfinished run whose claim ended, such as after a seat change, keeping its number and its history.
 *
 * @extends Command<int>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(ResumeTaskRunHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Start)]
final readonly class ResumeTaskRun extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $runId) {}

    public function subject(): Task
    {
        return Task::lockedById(TaskRun::lockedById($this->runId)->task_id);
    }
}
