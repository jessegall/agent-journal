<?php

declare(strict_types=1);

namespace App\Support\References;

use App\Enums\NoSubject;
use App\Values\WorkReference;

/**
 * Names a state to put on a stack: its registered type and the subject run it is about.
 */
final readonly class StateReference
{
    /**
     * @param  array<string, mixed>  $values  the state's first values, by the name of its data, which a push builds it
     *                                        from; they are no part of which state it names
     */
    public function __construct(
        public string $typeKey,
        public SubjectReference|NoSubject $subject,
        public array $values = [],
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
