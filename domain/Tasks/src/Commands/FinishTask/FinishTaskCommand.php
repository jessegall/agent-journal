<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\FinishTask;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\RecordCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\RecordPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Finishes the caller's current run of a task with a result note; the task's work ends on every stack.
 *
 * @extends Command<null>
 */
#[Authorize(RecordPolicy::class, AccessType::Edit)]
final readonly class FinishTaskCommand extends Command implements RecordCommand
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $note,
    ) {}

    public function subject(): Task
    {
        return Task::findLockedById($this->taskId);
    }
}
