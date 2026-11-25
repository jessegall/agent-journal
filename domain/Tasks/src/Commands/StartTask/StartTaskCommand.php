<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\StartTask;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\RecordCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\RecordPolicy;

/**
 * Starts a task for the agent of a session and answers its run number; the start and the push of its state commit
 * together.
 *
 * @extends Command<int>
 */
#[Authorize(RecordPolicy::class, AccessType::Create)]
final readonly class StartTaskCommand extends Command implements RecordCommand
{
    public function __construct(
        public string $taskId,
    ) {}

    public function subject(): Task
    {
        return Task::lockedForStart($this->taskId);
    }
}
