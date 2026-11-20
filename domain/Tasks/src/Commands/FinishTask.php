<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Handlers\FinishTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskRunPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Finishes the caller's current run of a task with a result note; the task's work ends on every stack.
 *
 * @extends Command<null>
 */
#[HandledBy(FinishTaskHandler::class)]
#[Authorize(TaskRunPolicy::class, AccessType::Edit)]
final readonly class FinishTask extends Command implements RecordCommand
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $note,
    ) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
