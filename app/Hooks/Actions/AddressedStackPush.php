<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StatePush;
use App\Hooks\Support\StackTransaction;

/**
 * Pushes a state onto the running stack of an actor work is addressed to, inside the caller's stack transaction; a
 * guessed, ended or mismatched target is refused.
 */
final readonly class AddressedStackPush
{
    public function __construct(
        private StackTransaction $transaction,
        private StatePush $statePush,
    ) {}

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->transaction->requireOpen($target);

        $role = $this->roleOf($target);
        $this->statePush->push($target, AgentStackRow::lockAuthorizedFor($target), $role, $state);
    }

    /**
     * The role of the target's agent, read from its running session.
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
