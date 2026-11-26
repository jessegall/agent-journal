<?php

declare(strict_types=1);

namespace Domain\Tasks\Commands\UnfocusTask;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Tasks\Policies\TaskPolicy;

/**
 * Takes a task out of the caller's focus as its work leaves the caller's stack, after its run may have ended; a task
 * in nobody's focus, or in another agent's, is left as it is.
 *
 * @extends Command<null>
 */
#[Authorize(TaskPolicy::class, AccessType::Read)]
final readonly class UnfocusTaskCommand extends Command
{
    public function __construct(public string $taskId) {}
}
