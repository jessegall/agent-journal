<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\JournalAccessPolicy;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AutoAssignmentDenied;

/**
 * The journal's owner reads and changes anyone's auto-assignments, its own included. A dispatching agent reads and
 * changes another agent's, never its own and never a user's. Any other agent only reads its own; nobody else
 * anything.
 */
final readonly class OwnerAutoAssignmentAccess implements AutoAssignmentAccess
{
    public function __construct(
        private JournalAccessPolicy $access,
        private AgentAuthority $agents,
    ) {}

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function requireRead(Actor $actor, ActorIdentity $target): void
    {
        if ($this->access->allows($actor) || self::isSelf($actor, $target)) {
            return;
        }

        $this->requireDispatcherOfAnotherAgent($actor, $target, AutoAssignmentDenied::forRead($actor));
    }

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function requireWrite(Actor $actor, ActorIdentity $target): void
    {
        if ($this->access->allows($actor)) {
            return;
        }

        $this->requireDispatcherOfAnotherAgent($actor, $target, AutoAssignmentDenied::forWrite($actor));
    }

    public function mayReadTotals(Actor $actor, ActorIdentity $target): bool
    {
        return $this->access->allows($actor) || ! self::isSelf($actor, $target);
    }

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    private function requireDispatcherOfAnotherAgent(
        Actor $actor,
        ActorIdentity $target,
        AutoAssignmentDenied $denial,
    ): void {
        if ($actor->actorType() !== ActorType::Agent || $target->type !== ActorType::Agent) {
            throw $denial;
        }

        if (self::isSelf($actor, $target)) {
            throw $denial;
        }

        $this->agents->requireDispatcher($actor->actorId());
    }

    private static function isSelf(Actor $actor, ActorIdentity $target): bool
    {
        return ActorIdentity::of($actor)->isSameAs($target);
    }
}
