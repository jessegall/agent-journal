<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Contracts\CurrentSession;
use Domain\Tasks\Models\Task;

/**
 * Who works on tasks in this request: an agent through its session, or the user, who has none.
 */
final readonly class TaskCaller
{
    public function __construct(private CurrentActor $actors, private CurrentSession $session) {}

    /**
     * The calling agent's session, or null for the user and the journal itself.
     */
    public function sessionId(): string|null
    {
        return $this->isAgent() ? $this->session->sessionId() : null;
    }

    /**
     * The user and a main agent may cancel any task; another agent only a run its own session owns.
     */
    public function mayCancel(Task $task): bool
    {
        return ! $this->isAgent() || $this->session->isMainAgent() || $task->isRunOwnedBy($this->session->sessionId());
    }

    private function isAgent(): bool
    {
        return $this->actors->actor()->type === ActorType::Agent;
    }
}
