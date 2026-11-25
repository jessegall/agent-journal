<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\RemoveTaskWait;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Removes a task's wait on another; the wait's history keeps that it was there.
 *
 * @extends Command<null>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class RemoveTaskWaitCommand extends Command
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
    ) {}
}
