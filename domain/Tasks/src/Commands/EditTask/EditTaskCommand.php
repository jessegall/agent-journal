<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\EditTask;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;

/**
 * Gives a task a new title, brief or both, refused when the task moved past the revision the caller read; answers the
 * new revision. A title or brief left out stays as it is.
 *
 * @extends Command<int>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
final readonly class EditTaskCommand extends Command
{
    public function __construct(
        public string $taskId,
        public int $expectedRevision,
        #[RequiredWithout('brief'), Max(Task::TITLE_CHARACTER_LIMIT)]
        public string|null $title = null,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public string|null $brief = null,
    ) {}
}
