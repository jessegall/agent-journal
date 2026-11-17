<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Exceptions\InvalidAssignmentIdentity;

/**
 * One assignment as it was read: its row id and its holder. A command that changes an assignment names the reference
 * it expects, so a stale view is refused instead of overwriting a newer holder.
 */
final readonly class AssignmentReference
{
    /**
     * @throws InvalidAssignmentIdentity
     */
    public function __construct(
        public int $id,
        public ActorIdentity $holder,
    ) {
        if ($id < 1) {
            throw InvalidAssignmentIdentity::forReference($id);
        }
    }

    public function isSameAs(self $other): bool
    {
        return $this->id === $other->id && $this->holder->isSameAs($other->holder);
    }
}
