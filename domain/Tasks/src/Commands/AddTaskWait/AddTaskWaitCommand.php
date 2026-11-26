<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\AddTaskWait;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Attributes\Commands\RequiresRequestKey;
use App\Support\Command;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Makes a task wait on another: it is not ready until the other is finished or the wait is waived.
 *
 * @extends Command<string>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class AddTaskWaitCommand extends Command
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
    ) {}
}
