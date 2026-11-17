<?php

declare(strict_types=1);

namespace App\Core\Hooks;

use App\Core\Agents\Models\AgentSession;
use App\Core\Contracts\CurrentActor;
use App\Core\Hooks\Contracts\PersonStack;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Exceptions\StackTargetRefused;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Stack\StackRestorer;
use App\Core\Hooks\States\ReadyStateType;

/**
 * Pushes a state onto a running agent's stack for the person acting in this request, such as a message they want
 * answered. The agent stays the target: its own role restores the stack, its frames stay, and the change runs in the
 * caller's stack transaction under the stack's row lock. An agent never reaches another agent's stack this way.
 */
final readonly class PersonStacks implements PersonStack
{
    public function __construct(
        private StackTransaction $transaction,
        private CurrentActor $actors,
        private StackRestorer $restorer,
    ) {}

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->actors->actor()->requirePerson();
        $this->transaction->requireOpen($target);

        $role = $this->roleOf($target);
        $row = AgentStackRow::lockAuthorizedFor($target);
        $stack = $this->restorer->restore($row->frames, $role)->withStateOnTop($state);

        $row->saveFrames($stack->records());
    }

    /**
     * The role of the target's agent, read from its running session; a guessed, ended or mismatched target is refused.
     */
    private function roleOf(StackTarget $target): ReadyStateType
    {
        $session = AgentSession::query()->whereKey($target->sessionId)->where('agent_id', $target->agentId)->first();

        if ($session === null || ! $session->isActive()) {
            throw StackTargetRefused::forTarget($target->description());
        }

        return ReadyStateType::forKey($session->agent->role);
    }
}
