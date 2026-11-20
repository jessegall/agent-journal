<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\CancelTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Cancels a task with a reason: the user or a main agent any task, another agent only its own run.
 *
 * @extends Command<null>
 */
#[HandledBy(CancelTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Cancel)]
#[Operation('cancel_task', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class CancelTask extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $taskId,
        #[Max(Task::NOTE_CHARACTERS)]
        public string $reason,
    ) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
