<?php

declare(strict_types=1);

namespace App\Core\Assignments\Events;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Enums\AssignmentReason;
use App\Core\Assignments\Support\AssignmentChange;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The one fact a command that changed assignments raises, after its transaction committed: who did it, why, and every
 * record whose holder changed. A command that changed nothing raises none. Delivery is not guaranteed and nothing is
 * kept to replay it.
 */
final readonly class AssignmentsChanged implements ShouldDispatchAfterCommit
{
    /**
     * @param  list<AssignmentChange>  $changes
     */
    public function __construct(
        public string $operationId,
        public ActorIdentity $actor,
        public AssignmentReason $reason,
        public array $changes,
        public DateTimeImmutable $occurredAt,
    ) {}
}
