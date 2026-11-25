<?php

declare(strict_types=1);

namespace App\Support\Mutations;

use App\Exceptions\FrameNotHeld;
use App\Models\Agents\AgentStackRow;
use App\Support\References\StateReference;
use App\Support\Stack\AgentStack;
use App\Support\Stack\StackRestorer;
use App\Support\Stack\StateCommandPublisher;
use App\Support\Stack\StateTypes;
use App\Values\StackTarget;

/**
 * The one way a state is pushed onto a stack, for every caller that has already authorized and locked it: finished
 * frames leave, the state goes on top unless the stack already holds it, and the stack is saved when its frames
 * changed.
 */
final readonly class StatePush
{
    public function __construct(
        private StackRestorer $restorer,
        private StateTypes $types,
        private StateCommandPublisher $stateCommands,
    ) {}

    /**
     * Pushes the state and answers the stack as it was saved, for a caller that checks what the push left.
     */
    public function push(StackTarget $target, AgentStackRow $row, StateReference $reference): AgentStack
    {
        $before = $this->restorer->restore($row->frames, $row->target);
        $after = $before->withoutExposedInactive()->withStateOnTop($reference);
        $this->save($target, $row, $before, $after);

        return $after;
    }

    /**
     * Lifts the live frame of the reference to the top with its own values and answers the stack as it was saved.
     *
     * @throws FrameNotHeld when the stack holds no live frame for the reference
     */
    public function lift(StackTarget $target, AgentStackRow $row, StateReference $reference): AgentStack
    {
        $before = $this->restorer->restore($row->frames, $row->target);

        if (! $before->holdsLive($reference)) {
            throw FrameNotHeld::for($reference, $target);
        }

        $after = $before->withLiveFrameLifted($reference);
        $this->save($target, $row, $before, $after);

        return $after;
    }

    private function save(StackTarget $target, AgentStackRow $row, AgentStack $before, AgentStack $after): void
    {
        if ($after->frameIds() === $before->frameIds()) {
            return;
        }

        // The moments run first: what a state sets on entering, resuming or leaving is saved with its frame.
        $this->stateCommands->publishMoments($target, $before->snapshot(), $after);
        $row->saveFrames($after->records(), $this->types->ticking());
    }
}
