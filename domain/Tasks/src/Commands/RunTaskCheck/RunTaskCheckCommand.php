<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\RunTaskCheck;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\RecordCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\RecordPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Makes a process run the caller opened a check of the caller's current run of a task, under the check's name; the
 * run's published result becomes the task's proof once it comes.
 *
 * @extends Command<string>
 */
#[Authorize(RecordPolicy::class, AccessType::Edit)]
final readonly class RunTaskCheckCommand extends Command implements RecordCommand
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        public string $processRunId,
        #[Max(200)]
        public string $operation,
    ) {}

    public function subject(): Task
    {
        return Task::findLockedById($this->taskId);
    }
}
