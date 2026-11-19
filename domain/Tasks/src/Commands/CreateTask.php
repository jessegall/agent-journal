<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\CreateTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Creates an open task with its title and brief and answers its id; the task takes the journal's next task number
 * and records who created it.
 *
 * @implements Command<string>
 */
#[HandledBy(CreateTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Work)]
final readonly class CreateTask implements Command, HasAuthorizationSubject
{
    public function __construct(public string $title, public string $brief) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Task::class;
    }
}
