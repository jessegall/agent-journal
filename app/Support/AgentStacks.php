<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Work\AgentStack;
use App\Models\Agents\AgentStackRow;
use App\Support\Mutations\StatePush;
use App\Support\References\Exceptions\ActivationDeclined;
use App\Support\References\StateReference;
use App\Values\StackTarget;

/**
 * Pushes states onto an agent's stack, by its target, onto the acting actor's own stacks, or onto another actor's,
 * always inside the caller's stack transaction and under the stack's row lock.
 */
final readonly class AgentStacks implements AgentStack
{
    public function __construct(
        private StackTransaction $transaction,
        private StackAccess $access,
        private StatePush $statePush,
        private CallerStackTargets $targets,
        private AddressedStackPush $addressed,
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

    public function lift(StackTarget $target, StateReference $state): void
    {
        $this->transaction->assertOpen($target);
        $this->access->assertTargetGranted($target);

        $this->statePush->lift($target, AgentStackRow::lockFor($target), $state);
    }

    public function activateForCaller(StateReference $state): void
    {
        foreach ($this->targets->ofCaller() as $target) {
            $this->activate($target, $state);
        }
    }

    public function liftForCaller(StateReference $state): void
    {
        foreach ($this->targets->ofCaller() as $target) {
            $this->lift($target, $state);
        }
    }

    public function pushFor(ActorIdentity $actor, StateReference $state): void
    {
        foreach ($this->targets->lockedRowsOf($actor) as $row) {
            $this->addressed->push($row->target, $state);
        }
    }

    public function offerFor(ActorIdentity $actor, StateReference $state): void
    {
        $this->addressed->offer($this->targets->lockedRowsOf($actor), $state);
    }
}
