<?php

declare(strict_types=1);

namespace Domain\Tasks\Values;

use Domain\Tasks\Enums\TaskStatus;
use PhpOption\Option;

/**
 * Who works on a task now, apart from who holds it: the actor and its label (null when the caller may not see that
 * agent's name), the run, how that run stands, and whether it runs now: a started current run with a live claim.
 */
final readonly class TaskExecution
{
    /**
     * @param  Option<string>  $focusedBy  the name of the agent whose focus the task is in
     */
    public function __construct(
        public string $actorType,
        public string $actorId,
        public string|null $actorLabel,
        public int $runNumber,
        public TaskStatus $state,
        public bool $isRunningNow,
        public Option $focusedBy,
    ) {}
}
