<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Removes a task's wait on another; the wait's history keeps that it was there.
 *
 * @extends Command<null>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RemoveTaskWait extends Command
{
    public function __construct(
        public string $dependentTaskId,
        public string $prerequisiteTaskId,
    ) {}
}
