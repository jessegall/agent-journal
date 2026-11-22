<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Models\AgentSession;
use App\Agents\Values\StackTarget;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;
use PhpOption\None;
use PhpOption\Option;

/**
 * Restores only captured event targets, under the caller's stack transaction.
 */
final readonly class StateEventStacks
{
    public function __construct(private StackRestorer $restorer, private StateTypes $types) {}

    /**
     * @return Option<AgentStack>
     */
    public function restoreActive(StateEventDispatch $dispatch, StackTarget $target): Option
    {
        $dispatch->assertTargetGranted($target);

        if (! AgentSession::lockRunningTarget($target)) {
            return None::create();
        }

        return AgentStackRow::lockActiveAuthorizedFor($target)->map(
            fn (AgentStackRow $row) => $this->restorer->restore($row->frames, $row->target()),
        );
    }

    /**
     * Saves the stack's frames again when a listener changed a state's own values, under the caller's stack
     * transaction, so the next restore hands them back.
     */
    public function keepValues(StackTarget $target, AgentStack $stack): void
    {
        $after = $stack->records();

        AgentStackRow::lockActiveAuthorizedFor($target)
            ->filter(fn (AgentStackRow $row) => ! $row->frames->hasSameValuesAs($after))
            ->forAll(fn (AgentStackRow $row) => $row->saveFrames($after, $this->types->ticking()));
    }
}
