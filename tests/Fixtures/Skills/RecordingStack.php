<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills;

use App\Stacks\Contracts\Work\AgentStacks;
use App\Stacks\References\StateReference;
use App\Support\ActorReference;
use App\Values\StackTarget;

/**
 * An agent stack that only records what was pushed, for listeners tested outside a hook call.
 */
final class RecordingStack implements AgentStacks
{
    /**
     * @var list<StateReference>
     */
    public array $pushed = [];

    /**
     * @var list<StateReference>
     */
    public array $lifted = [];

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->pushed[] = $state;
    }

    public function activate(StackTarget $target, StateReference $state): void
    {
        $this->pushed[] = $state;
    }

    public function lift(StackTarget $target, StateReference $state): void
    {
        $this->lifted[] = $state;
    }

    public function activateForCaller(StateReference $state): void
    {
        $this->pushed[] = $state;
    }

    public function liftForCaller(StateReference $state): void
    {
        $this->lifted[] = $state;
    }

    public function pushFor(ActorReference $actor, StateReference $state): void
    {
        $this->pushed[] = $state;
    }

    public function pushForSession(StackTarget $target, StateReference $state): void
    {
        $this->pushed[] = $state;
    }

    public function offerFor(ActorReference $actor, StateReference $state): void
    {
        $this->pushed[] = $state;
    }
}
