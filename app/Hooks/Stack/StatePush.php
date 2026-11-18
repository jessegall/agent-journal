<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\ReadyStateType;
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

    public function push(StackTarget $target, AgentStackRow $row, ReadyStateType $role, StateReference $reference): void
    {
        $this->lifecycle->refuseChangeDuringCallbacks($target);
        $before = $this->restorer->restore($row->frames, $role);
        $after = $before->withoutFinishedFrames()->withStateOnTop($reference);

        if ($after->frameIds() === $before->frameIds()) {
            return;
        }

        $this->lifecycle->settle($target, $before, $after);
        $row->saveFrames($after->records(), $this->types->ticking());
    }
}
