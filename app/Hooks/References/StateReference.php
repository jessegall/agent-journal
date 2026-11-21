<?php

declare(strict_types=1);

namespace App\Hooks\References;

use App\Agents\Values\WorkReference;
use App\Hooks\Enums\NoSubject;

/**
 * Names a state to put on a stack: its registered type and the subject run it is about.
 */
final readonly class StateReference
{
    public function __construct(
        public string $typeKey,
        public SubjectReference|NoSubject $subject,
    ) {}

    /**
     * Whether both name the same state type about the same subject run.
     */
    public function isSameAs(self $other): bool
    {
        return $this->typeKey === $other->typeKey && $this->subject == $other->subject;
    }

    public function isForWork(WorkReference $work): bool
    {
        return $this->workReference()->key === $work->key;
    }

    public function workReference(): WorkReference
    {
        $work = WorkOccurrence::of($this);

        return new WorkReference($work->lockKey().'/'.$work->occurrence);
    }
}
