<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Values\WorkOccurrence;

/**
 * A command a tick may produce that changes work besides its origin: it names every other work subject it locks,
 * before it runs, so the engine takes all of them in one stable order and two ticks never wait on each other.
 */
interface TickSubjectLocks
{
    /**
     * @return list<WorkOccurrence>
     */
    public function lockedSubjects(): array;
}
