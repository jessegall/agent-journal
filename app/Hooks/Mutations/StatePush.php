<?php

declare(strict_types=1);

namespace App\Hooks\Mutations;

use App\Agents\Values\StackTarget;
use App\Hooks\References\StateReference;
use App\Hooks\Settlement\FrameLifecycle;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;

/**
 * The one way a state is pushed onto a stack, for every caller that has already authorized and locked it: finished
 * frames leave, the state goes on top unless the stack already holds it, the lifecycle methods run, and the stack is
 * saved when its frames changed.
 */
final readonly class StatePush
{
    public function __construct(
        private StackRestorer $restorer,
        private FrameLifecycle $lifecycle,
        private StateTypes $types,
    ) {}

    /**
     * Pushes the state and answers the stack as it was saved, for a caller that checks what the push left.
     */
    public function push(StackTarget $target, AgentStackRow $row, StateReference $reference): AgentStack
    {
        $this->lifecycle->assertNotInCallbacks($target);
        $before = $this->restorer->restore($row->frames, $row->target());
        $after = $before->withoutExposedInactive()->withStateOnTop($reference);
        $this->save($target, $row, $before, $after);

        return $after;
    }

    public function prune(StackTarget $target, AgentStackRow $row): void
    {
        $this->lifecycle->assertNotInCallbacks($target);
        $before = $this->restorer->restore($row->frames, $row->target());
        $this->save($target, $row, $before, $before->withoutExposedInactive());
    }

    private function save(StackTarget $target, AgentStackRow $row, AgentStack $before, AgentStack $after): void
    {
        if ($after->frameIds() === $before->frameIds()) {
            return;
        }

        $this->lifecycle->settle($target, $before, $after);
        $row->saveFrames($after->records(), $this->types->ticking());
    }
}
