<?php

declare(strict_types=1);

namespace App\Engine;

use App\Engine\Exceptions\TickSubjectUndeclared;
use App\Engine\References\Exceptions\WorkOccurrenceStale;
use App\Engine\Values\WorkLockSet;
use App\Support\StateCatalog\Contracts\StateTypes;
use Closure;

/**
 * The work the tick command running now locks: its origin and the subjects it declared. Every command it runs, nested
 * ones too, takes those locks in order and checks the work is still live before its handler, so a finish between two
 * commands of one tick refuses the second, and two ticks never wait on each other in opposite order.
 */
final class TickOrigins
{
    /**
     * The lock set of the tick command running now; empty outside a tick.
     *
     * @var list<WorkLockSet>
     */
    private array $running = [];

    public function __construct(private readonly StateTypes $types) {}

    /**
     * Runs one tick command with its lock set.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $command
     * @return TResult
     */
    public function runWith(WorkLockSet $locks, Closure $command): mixed
    {
        $before = $this->running;
        $this->running = [$locks];

        try {
            return $command();
        } finally {
            $this->running = $before;
        }
    }

    /**
     * Takes the running tick command's locks in order, its origin first, and refuses work that is over or a nested
     * command that locks work the tick command did not declare; outside a tick there is nothing to lock.
     *
     * @throws WorkOccurrenceStale
     * @throws TickSubjectUndeclared
     */
    public function lockFor(object $command): void
    {
        foreach ($this->running as $locks) {
            if (! $locks->covers($command)) {
                throw TickSubjectUndeclared::forCommand($command::class);
            }

            foreach ($locks->inLockOrder() as $subject) {
                $this->types->occurrenceGuardOf($subject->typeKey)->lockAndRequireLive($subject);
            }
        }
    }
}
