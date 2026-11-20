<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\StackRestorer;
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
        $dispatch->checkTarget($target);

        if (! AgentSession::lockRunningTarget($target)) {
            return None::create();
        }

        return AgentStackRow::lockActiveAuthorizedFor($target)->map(
            fn (AgentStackRow $row) => $this->restorer->restore($row->frames),
        );
    }
}
