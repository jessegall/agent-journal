<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\ApplyTaskWaits;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Tasks\Policies\TaskPolicy;
use Domain\Tasks\Values\TaskWaitPair;

/**
 * Adds and removes several waits among a plan's tasks at once, only against the graph version they were read at, and
 * answers the graph's new version.
 *
 * @extends Command<string>
 */
#[Authorize(TaskPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class ApplyTaskWaitsCommand extends Command
{
    /**
     * @param  list<string>  $taskIds  the plan's tasks, whose graph the version is of
     * @param  list<TaskWaitPair>  $added
     * @param  list<TaskWaitPair>  $removed
     */
    public function __construct(
        public array $taskIds,
        public string $baseVersion,
        public array $added,
        public array $removed,
    ) {}
}
