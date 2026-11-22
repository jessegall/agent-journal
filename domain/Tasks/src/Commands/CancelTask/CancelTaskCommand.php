<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\CancelTask;

use App\Bus\Attributes\Authorize;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskRunPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;

/**
 * Cancels an open, started or blocked task with a reason that is not blank: the user or a main agent any task, another
 * agent only its own run. A caller that read the task names the revision and latest run it read, and a task that moved
 * on since is refused with its current state.
 *
 * @extends Command<null>
 */
#[Authorize(TaskRunPolicy::class, AccessType::Edit)]
final readonly class CancelTaskCommand extends Command implements RecordCommand
{
    public function __construct(
        public string $taskId,
        #[Max(Task::NOTE_CHARACTER_LIMIT), Regex('/\S/')]
        public string $reason,
        public int|null $expectedRevision = null,
        public int|null $expectedRunNumber = null,
    ) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
