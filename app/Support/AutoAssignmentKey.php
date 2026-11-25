<?php

declare(strict_types=1);

namespace App\Support;

/**
 * Which auto-assignment is meant: one actor and one assignable record type.
 */
final readonly class AutoAssignmentKey
{
    public function __construct(
        public ActorReference $actor,
        public string $assignableType,
    ) {}

    /**
     * Whether the auto-assignment is this actor's.
     */
    public function isOf(ActorReference $actor): bool
    {
        return $this->actor->isSameAs($actor);
    }
}
