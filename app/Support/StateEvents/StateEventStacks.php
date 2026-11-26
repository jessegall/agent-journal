<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Access\StateEvents\StateEventDispatch;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Stacks\AgentStack;
use App\Stacks\StackRestorer;
use App\Values\StackTarget;
use PhpOption\None;
use PhpOption\Option;

/**
 * Restores only captured event targets, under the caller's stack transaction.
 */
final readonly class StateEventStacks
{
    public function __construct(private StackRestorer $restorer) {}

    /**
     * @return Option<AgentStack>
     */
    public function restoreActive(StateEventDispatch $dispatch, StackTarget $target): Option
    {
        $dispatch->assertTargetGranted($target);

        if (! AgentSession::hasLockedRunningTarget($target)) {
            return None::create();
        }

        return AgentStackRow::findLockedActiveAuthorizedFor($target)->map(
            fn (AgentStackRow $row) => $this->restorer->restore($row->frames, $row->target),
        );
    }
}
