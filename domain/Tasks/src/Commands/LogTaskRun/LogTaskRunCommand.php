<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\LogTaskRun;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\RecordCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\RecordPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Adds a line to the log of the caller's current run of a task, kept against that run as it is now.
 *
 * @extends Command<string>
 */
#[Authorize(RecordPolicy::class, AccessType::Edit)]
final readonly class LogTaskRunCommand extends Command implements RecordCommand
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $text,
    ) {}

    public function subject(): Task
    {
        return Task::findLockedById($this->taskId);
    }
}
