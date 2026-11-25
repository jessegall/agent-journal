<?php

declare(strict_types=1);

namespace App\Events\Assignments;

use App\Contracts\Navigation\ClientUpdate;
use App\Enums\Assignments\AssignmentReason;
use App\Support\ActorIdentity;
use App\Support\AssignmentChange;
use DateTimeImmutable;

/**
 * The one fact a command that changed assignments raises, after its transaction committed: who did it, why, and every
 * record whose holder changed. A command that changed nothing raises none. Delivery is not guaranteed and nothing is
 * kept to replay it.
 */
final readonly class AssignmentsChanged extends AssignmentEvent implements ClientUpdate
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
