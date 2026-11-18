<?php

declare(strict_types=1);

namespace App\Hooks\Decisions;

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
}
