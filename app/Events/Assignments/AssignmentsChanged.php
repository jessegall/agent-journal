<?php

declare(strict_types=1);

namespace App\Events\Assignments;

use App\Assignments\AssignmentChange;
use App\Assignments\Enums\AssignmentReason;
use App\Navigation\Contracts\ClientUpdate;
use App\Support\ActorReference;
use DateTimeImmutable;

/**
 * The one fact a command that changed assignments raises, after its transaction committed: who did it, why, and every
 * record whose holder changed. A command that changed nothing raises none. Delivery is not guaranteed and nothing is
 * kept to replay it.
 */
final readonly class AssignmentsChanged implements AssignmentEvent, ClientUpdate
{
    /**
     * @param  list<AssignmentChange>  $changes
     */
    public function __construct(
        public string $operationId,
        public ActorReference $actor,
        public AssignmentReason $reason,
        public array $changes,
        public DateTimeImmutable $occurredAt,
    ) {}
}
