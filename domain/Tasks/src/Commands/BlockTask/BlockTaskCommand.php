<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\BlockTask;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\RecordCommand;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskRunPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Blocks the caller's current started run of a task with the reason it waits, not blank; the task's work ends on every
 * stack. A blocked task is not blocked a second time.
 *
 * @extends Command<null>
 */
#[Authorize(TaskRunPolicy::class, AccessType::Edit)]
final readonly class BlockTaskCommand extends Command implements RecordCommand
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        #[Required, Max(Task::NOTE_CHARACTER_LIMIT), Regex('/\S/')]
        public string $reason,
    ) {}

    public function subject(): Task
    {
        return Task::findLockedById($this->taskId);
    }
}
