<?php

declare(strict_types=1);

namespace App\Web\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Contracts\TargetAuthorizer;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Exceptions\AutoAssignmentDenied;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Policies\AssignmentPolicy;

/**
 * The journal's owner reads and changes anyone's auto-assignments, its own included. A dispatching agent reads and
 * changes another agent's, never its own and never a user's; an actor with no stored authority, such as the engine,
 * neither. Any other agent only reads its own; nobody else
 * anything.
 */
final readonly class OwnerAutoAssignmentAccess implements AutoAssignmentAccess
{
    public function __construct(
        private JournalAdmission $admission,
        private AgentAuthority $agents,
        private TargetAuthorizer $authorizer,
    ) {}

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function assertMayRead(Actor $actor, ActorIdentity $target): void
    {
        if ($this->admission->admits($actor) || self::isSelf($actor, $target)) {
            return;
        }

        $this->requireDispatcherOfAnotherAgent($actor, $target, AutoAssignmentDenied::forRead($actor));
    }

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function assertMayWrite(Actor $actor, ActorIdentity $target): void
    {
        if ($this->admission->admits($actor)) {
            return;
        }

        $this->requireDispatcherOfAnotherAgent($actor, $target, AutoAssignmentDenied::forWrite($actor));
    }

    public function mayReadTotals(Actor $actor, ActorIdentity $target): bool
    {
        return $this->admission->admits($actor) || ! self::isSelf($actor, $target);
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
        if (! $target->type->isAgent()) {
            throw $denial;
        }

        if (self::isSelf($actor, $target)) {
            throw $denial;
        }

        $this->requireStoredAuthority($actor, $denial);
        $this->agents->requireDispatcher($actor->actorId());
    }

    /**
     * Refuses an actor that holds no stored authority another request could evaluate, such as the engine.
     *
     * @throws AutoAssignmentDenied
     */
    private function requireStoredAuthority(Actor $actor, AutoAssignmentDenied $denial): void
    {
        try {
            $this->authorizer->filterActions(
                ActorIdentity::of($actor),
                AssignmentPolicy::class,
                AssignmentRecord::class,
                [],
            );
        } catch (ActorNotAllowed|ActorUnavailable) {
            throw $denial;
        }
    }

    private static function isSelf(Actor $actor, ActorIdentity $target): bool
    {
        return ActorIdentity::of($actor)->isSameAs($target);
    }
}
