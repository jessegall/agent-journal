<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Contracts\RecordCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;

/**
 * Waives a task's wait on another with the reason it no longer has to wait, for whoever may resolve the waiting task.
 *
 * @extends Command<null>
 */
#[Authorize(TaskPolicy::class, AccessType::Admin)]
final readonly class WaiveTaskWait extends Command implements RecordCommand
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
        #[Min(1), Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $reason,
    ) {}

    public function subject(): Task
    {
        return Task::ofId($this->dependentTaskId);
    }
}
