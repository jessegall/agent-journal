<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Policies\TaskRunPolicy;

/**
 * Takes up an unfinished run whose claim ended, such as after a seat change, keeping its number and its history.
 *
 * @extends Command<int>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(TaskRunPolicy::class, AccessType::Create)]
final readonly class ResumeTaskRun extends Command implements RecordCommand
{
    public function __construct(public string $runId) {}

    public function subject(): Task
    {
        return Task::lockedById(TaskRun::lockedById($this->runId)->task_id);
    }
}
