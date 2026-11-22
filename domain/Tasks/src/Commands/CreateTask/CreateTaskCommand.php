<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\CreateTask;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Creates an open task with its title and brief and answers its id; the task takes the journal's next task number
 * and records who created it.
 *
 * @extends Command<string>
 */
#[Authorize(TaskPolicy::class, AccessType::Create)]
final readonly class CreateTaskCommand extends Command
{
    public function __construct(
        #[Max(Task::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $brief,
    ) {}
}
