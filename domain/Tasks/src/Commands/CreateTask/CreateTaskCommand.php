<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\CreateTask;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Projects\Contracts\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Creates an open task of a project with its title and brief and answers its id; the task takes the journal's next
 * task number and records who created it.
 *
 * @extends Command<string>
 */
#[Authorize(TaskPolicy::class, AccessType::Create)]
final readonly class CreateTaskCommand extends Command implements ProjectCommand
{
    public function __construct(
        #[Required, Max(Task::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $brief,
        public string $projectId,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
