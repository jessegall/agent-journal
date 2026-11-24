<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\StackTargetRefused;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Support\Mutations\StatePush;
use App\Support\References\StateReference;
use App\Support\Stack\StackRestorer;
use App\Values\StackTarget;

/**
 * Pushes a state onto the running stack of an actor work is addressed to, inside the caller's stack transaction; a
 * guessed, ended or mismatched target is refused.
 */
final readonly class AddressedStackPush
{
    public function __construct(
        private StackTransaction $transaction,
        private StatePush $statePush,
        private StackRestorer $restorer,
    ) {}

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->transaction->assertOpen($target);

        $this->assertRunning($target);
        $stack = AgentStackRow::lockAuthorizedFor($target);
        $this->statePush->push($target, $stack, $state);
    }

    /**
     * @param  list<AgentStackRow>  $stacks
     */
    public function offer(array $stacks, StateReference $state): void
    {
        $restored = array_map(
            fn (AgentStackRow $stack) => $this->restorer->restore($stack->frames, $stack->target),
            $stacks,
        );

        foreach ($restored as $stack) {
            if (! $stack->top()->isBottom()) {
                return;
            }
        }

        $stack = $stacks[0] ?? null;

        if ($stack === null) {
            return;
        }

        $target = $stack->target;
        $this->transaction->assertOpen($target);
        $this->statePush->push($target, $stack, $state);
    }

    /**
     * Refuses a target whose session is not running.
     */
    private function assertRunning(StackTarget $target): void
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
