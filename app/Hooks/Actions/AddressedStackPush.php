<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StatePush;
use App\Hooks\StateEvents\StateEventScope;
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
        private StateEventScope $eventScope,
    ) {}

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->transaction->requireOpen($target);

        $this->requireRunning($target);
        $stack = AgentStackRow::lockAuthorizedFor($target);
        $this->eventScope->admit([$target], fn () => $this->statePush->push($target, $stack, $state));
    }

    /**
     * Refuses a target whose session is not running.
     */
    private function requireRunning(StackTarget $target): void
    {
        $session = AgentSession::query()
            ->whereKey($target->sessionId)
            ->where('agent_id', $target->agentId)
            ->first();

        if ($session === null || ! $session->isActive()) {
            throw StackTargetRefused::forTarget($target->description());
        }
    }
}
