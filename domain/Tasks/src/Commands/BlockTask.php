<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\BlockTaskHandler;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;

/**
 * Blocks the caller's current run of a task with the reason it waits; the task's work ends on every stack.
 *
 * @extends Command<null>
 */
#[HandledBy(BlockTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Block)]
final readonly class BlockTask extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $taskId,
        public int $runNumber,
        #[Max(Task::NOTE_CHARACTERS)] public string $reason,
    ) {}

    public function subject(): Task
    {
        return Task::lockedById($this->taskId);
    }
}
