<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Agents\Values\StackTarget;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Mutations\StatePush;
use App\Hooks\References\Exceptions\ActivationDeclined;
use App\Hooks\References\StateReference;
use App\Hooks\Support\StackAccess;
use App\Hooks\Support\StackTransaction;

/**
 * Pushes states onto the calling agent's own stack, always inside the caller's stack transaction and under the stack's
 * row lock.
 */
final readonly class AgentStacks implements AgentStack
{
    public function __construct(
        private StackTransaction $transaction,
        private StackAccess $access,
        private StatePush $statePush,
    ) {}

    /**
     * Puts a state on top of the stack in the caller's transaction; a state already on the stack keeps its place.
     */
    public function push(StackTarget $target, StateReference $state): void
    {
        $this->transaction->assertOpen($target);
        $this->access->assertTargetGranted($target);

        $this->statePush->push($target, AgentStackRow::lockFor($target), $state);
    }

    public function activate(StackTarget $target, StateReference $state): void
    {
        $this->transaction->assertOpen($target);
        $this->access->assertTargetGranted($target);

        if (! $this->statePush->push($target, AgentStackRow::lockFor($target), $state)->holdsLive($state)) {
            throw ActivationDeclined::for($state, $target);
        }
    }
}
