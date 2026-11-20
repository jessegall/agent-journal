<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Support\ActorIdentity;

/**
 * Which auto-assignment is meant: one actor and one assignable record type.
 */
final readonly class AutoAssignmentKey
{
    public function __construct(
        public ActorIdentity $actor,
        public string $assignableType,
    ) {}

    /**
     * Whether the auto-assignment is this actor's.
     */
    public function isOf(ActorIdentity $actor): bool
    {
        return $this->actor->isSameAs($actor);
    }
}
