<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills;

use App\Contracts\Work\AgentStacks;
use App\Support\ActorIdentity;
use App\Support\References\StateReference;
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

    public function pushFor(ActorIdentity $actor, StateReference $state): void
    {
        $this->pushed[] = $state;
    }

    public function offerFor(ActorIdentity $actor, StateReference $state): void
    {
        $this->pushed[] = $state;
    }
}
