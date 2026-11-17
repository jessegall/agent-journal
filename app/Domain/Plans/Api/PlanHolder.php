<?php

declare(strict_types=1);

namespace App\Domain\Plans\Api;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Support\AssignmentReference;

/**
 * Who holds a plan, as its card shows it: the assignment reference a deliberate change must name, and the holder's
 * display name.
 */
final readonly class PlanHolder
{
    public function __construct(
        public AssignmentReference $reference,
        public string $name,
    ) {}

    public function actor(): ActorIdentity
    {
        return $this->reference->holder;
    }
}
