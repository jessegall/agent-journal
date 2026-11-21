<?php

declare(strict_types=1);

namespace App\Hooks\Values;

use App\Hooks\References\Contracts\TickSubjectLocks;
use App\Hooks\References\WorkOccurrence;

/**
 * The work subjects one tick command locks: its origin first, then every subject it declares, ordered by state type and
 * subject id, so every command takes its locks in the same order.
 */
final readonly class WorkLockSet
{
    /**
     * @param  list<WorkOccurrence>  $others
     */
    private function __construct(public WorkOccurrence $origin, public array $others) {}

    public static function for(WorkOccurrence $origin, object $command): self
    {
        $declared = $command instanceof TickSubjectLocks ? $command->lockedSubjects() : [];
        $others = array_values(array_filter(
            $declared,
            fn (WorkOccurrence $subject): bool => ! $subject->isSameWorkAs($origin),
        ));
        usort(
            $others,
            fn (WorkOccurrence $first, WorkOccurrence $second): int => $first->lockKey() <=> $second->lockKey(),
        );

        return new self($origin, $others);
    }

    /**
     * @return list<WorkOccurrence> origin first
     */
    public function inLockOrder(): array
    {
        return [$this->origin, ...$this->others];
    }

    /**
     * Whether every subject the command declares is already in this set, as a command nested inside it needs.
     */
    public function covers(object $command): bool
    {
        if (! $command instanceof TickSubjectLocks) {
            return true;
        }

        $held = array_map(fn (WorkOccurrence $subject): string => $subject->lockKey(), $this->inLockOrder());

        return array_all(
            $command->lockedSubjects(),
            fn (WorkOccurrence $subject): bool => in_array($subject->lockKey(), $held, true),
        );
    }
}
