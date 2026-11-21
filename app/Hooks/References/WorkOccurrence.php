<?php

declare(strict_types=1);

namespace App\Hooks\References;

use App\Hooks\References\StateReference;
use App\Hooks\References\SubjectReference;

/**
 * One occurrence of the work a frame stands for: its state type, its subject and the run of that subject, such as run
 * 3 of task 41. A finished occurrence never comes alive again; a new run is a new occurrence.
 */
final readonly class WorkOccurrence
{
    public function __construct(
        public string $typeKey,
        public string $subjectId,
        public int $occurrence,
    ) {}

    /**
     * The occurrence a frame reference names; a state about no subject is its type's only occurrence.
     */
    public static function of(StateReference $reference): self
    {
        $subject = $reference->subject;

        return $subject instanceof SubjectReference
            ? new self($reference->typeKey, $subject->id, $subject->runNumber)
            : new self($reference->typeKey, '', 0);
    }

    /**
     * The key a lock order sorts by: the subject's type and id, whatever its occurrence.
     */
    public function lockKey(): string
    {
        return "{$this->typeKey}/{$this->subjectId}";
    }

    public function isSameWorkAs(self $other): bool
    {
        return $this->lockKey() === $other->lockKey();
    }

    public function description(): string
    {
        return "{$this->typeKey} {$this->subjectId} occurrence {$this->occurrence}";
    }
}
