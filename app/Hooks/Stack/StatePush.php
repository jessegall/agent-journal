<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Lifecycle\FrameLifecycle;
use App\Hooks\Models\AgentStackRow;

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

    public function push(StackTarget $target, AgentStackRow $row, StateReference $reference): void
    {
        $this->lifecycle->assertNotInCallbacks($target);
        $before = $this->restorer->restore($row->frames);
        $after = $before->withoutExposedInactive()->withStateOnTop($reference);
        $this->save($target, $row, $before, $after);
    }

    public function prune(StackTarget $target, AgentStackRow $row): void
    {
        $this->lifecycle->assertNotInCallbacks($target);
        $before = $this->restorer->restore($row->frames);
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
