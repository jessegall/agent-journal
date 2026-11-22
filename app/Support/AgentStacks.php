<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\AgentStack;
use App\Models\AgentStackRow;
use App\Support\Mutations\StatePush;
use App\Support\References\Exceptions\ActivationDeclined;
use App\Support\References\StateReference;
use App\Values\StackTarget;

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
