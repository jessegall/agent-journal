<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\WaiveTaskWait;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Policies\TaskPolicy;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Waives a task's wait on another with the reason it no longer has to wait, for whoever may resolve the waiting task.
 *
 * @extends Command<null>
 */
#[Authorize(TaskPolicy::class, AccessType::Admin)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class WaiveTaskWaitCommand extends Command
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
        #[Required, Min(1), Max(Task::NOTE_CHARACTER_LIMIT)]
        public string $reason,
    ) {}
}
