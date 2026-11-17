<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Actors\Support\ActorIdentity;

/**
 * Who holds a record, as a card shows it: the assignment, whose reference a deliberate change must name, and the
 * holder's display name.
 */
final readonly class AssignmentHolder
{
    public function __construct(
        public Assignment $assignment,
        public string $name,
    ) {}

    public function actor(): ActorIdentity
    {
        return $this->assignment->holder();
    }

    public function reference(): AssignmentReference
    {
        return $this->assignment->reference;
    }
}
