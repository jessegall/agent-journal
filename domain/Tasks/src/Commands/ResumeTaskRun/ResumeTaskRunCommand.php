<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\ResumeTaskRun;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Contracts\Bus\RecordCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
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
final readonly class ResumeTaskRunCommand extends Command implements RecordCommand
{
    public function __construct(public string $runId) {}

    public function subject(): Task
    {
        return Task::findLockedById(TaskRun::ownForUpdate($this->runId)->task_id);
    }
}
