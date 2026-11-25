<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Work\ActorStackSessions;
use App\Models\Agents\AgentStackRow;
use App\Values\StackTarget;

/**
 * The stacks of the acting actor, the sessions its operation is admitted to, and the open stacks of another actor's
 * running sessions; an actor that runs no session has none.
 */
final readonly class CallerStackTargets
{
    public function __construct(private CurrentActor $actors, private ActorStackSessions $sessions) {}

    /**
     * @return list<StackTarget>
     */
    public function ofCaller(): array
    {
        $actorId = $this->actors->actor()->actorId();

        return array_map(
            fn (string $sessionId) => new StackTarget($actorId, $sessionId),
            $this->sessions->admittableSessions(),
        );
    }

    /**
     * The open stacks of the actor's running sessions, locked; a session still starting has none yet.
     *
     * @return list<AgentStackRow>
     */
    public function lockedRowsOf(ActorIdentity $actor): array
    {
        return AgentStackRow::findLockedActiveOf($actor, $this->sessions->sessionsOf($actor));
    }
}
