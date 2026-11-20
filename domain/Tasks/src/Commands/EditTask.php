<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use Domain\Tasks\Enums\TaskAbility;
use Domain\Tasks\Handlers\EditTaskHandler;
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
#[HandledBy(EditTaskHandler::class)]
#[Authorize(TaskPolicy::class, TaskAbility::Work)]
final readonly class EditTask extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $taskId,
        public int $expectedRevision,
        #[RequiredWithout('brief'), Max(Task::TITLE_CHARACTERS)]
        public string|null $title = null,
        #[Max(Task::NOTE_CHARACTERS)]
        public string|null $brief = null,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Task::class;
    }
}
