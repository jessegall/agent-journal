<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Assignments\AutoAssignmentAccess;
use App\Contracts\Authorization\AgentAuthority;
use App\Contracts\Authorization\TargetAuthorizer;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\ActorUnavailable;
use App\Exceptions\AssignmentDenied;
use App\Exceptions\AutoAssignmentDenied;
use App\Models\Records\AssignmentRecord;
use App\Policies\AssignmentPolicy;

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
    public function assertMayRead(Actor $actor, ActorReference $target): void
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
    public function assertMayWrite(Actor $actor, ActorReference $target): void
    {
        if ($this->admission->admits($actor)) {
            return;
        }

        $this->requireDispatcherOfAnotherAgent($actor, $target, AutoAssignmentDenied::forWrite($actor));
    }

    public function mayReadTotals(Actor $actor, ActorReference $target): bool
    {
        return $this->admission->admits($actor) || ! self::isSelf($actor, $target);
    }

    /**
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    private function requireDispatcherOfAnotherAgent(
        Actor $actor,
        ActorReference $target,
        AutoAssignmentDenied $denial,
    ): void {
        if (! $target->isAgent()) {
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
                ActorReference::of($actor),
                AssignmentPolicy::class,
                AssignmentRecord::class,
                [],
            );
        } catch (ActorNotAllowed|ActorUnavailable) {
            throw $denial;
        }
    }

    private static function isSelf(Actor $actor, ActorReference $target): bool
    {
        return ActorReference::of($actor)->isSameAs($target);
    }
}
