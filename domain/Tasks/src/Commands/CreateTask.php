<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\CreateTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Creates an open task with its title and brief and answers its id; the task takes the journal's next task number
 * and records who created it.
 *
 * @extends Command<string>
 */
#[HandledBy(CreateTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Work)]
#[Operation('create_task', ResourceAreaType::JournalWork, AccessType::Create)]
final readonly class CreateTask extends Command implements AuthorizedCommand
{
    public function __construct(
        #[Max(Task::TITLE_CHARACTERS)]
        public string $title,
        #[Max(Task::NOTE_CHARACTERS)]
        public string $brief,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Task::class;
    }
}
