<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Support\StackTransaction;

/**
 * Pushes a state onto a running agent's stack for the user acting in this request, such as a message they want
 * answered. The agent stays the target: its own role restores the stack, its frames stay, and the change runs in the
 * caller's stack transaction under the stack's row lock. An agent never reaches another agent's stack this way.
 */
final readonly class UserStacks implements UserStack
{
    public function __construct(
        private StackTransaction $transaction,
        private CurrentActor $actors,
        private StackRestorer $restorer,
    ) {}

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->actors->actor()->requireUser();
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
        $session = AgentSession::query()->with('agent')->whereKey($target->sessionId)->where('agent_id', $target->agentId)->first();

        if ($session === null || ! $session->isActive()) {
            throw StackTargetRefused::forTarget($target->description());
        }

        return ReadyStateType::forKey($session->agent->role);
    }
}
