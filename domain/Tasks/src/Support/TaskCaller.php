<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use Domain\Tasks\Models\Task;

/**
 * Who works on tasks in this request: an agent, which owns its own runs, or the user, who may act on any run.
 */
final readonly class TaskCaller
{
    public function __construct(private CurrentActor $actors, private CurrentSession $session) {}

    /**
     * The agent whose runs the call may touch, or null for the user and the journal itself, who may touch any run.
     */
    public function runOwner(): ActorIdentity|null
    {
        $actor = $this->actors->actor();

        return $actor->type === ActorType::Agent ? ActorIdentity::of($actor) : null;
    }

    /**
     * The user and a main agent may cancel any task; another agent only a run it owns.
     */
    public function mayCancel(Task $task): bool
    {
        $owner = $this->runOwner();

        return $owner === null || $this->session->isMainAgent() || $task->isRunOwnedBy($owner);
    }
}
