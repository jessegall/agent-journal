<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Access\StateEvents\StateEventDispatch;
use App\Contracts\Events\Event;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Stacks\AgentStack;
use App\Stacks\Declarations\StateMethods;
use App\Stacks\StackRestorer;
use App\Stacks\StateLoading\RegisteredStateType;
use App\Support\StateCatalog\Contracts\StateTypes;
use App\Values\StackTarget;
use PhpOption\None;
use PhpOption\Option;

/**
 * Restores only captured event targets, under the caller's stack transaction.
 */
final readonly class StateEventStacks
{
    public function __construct(
        private StackRestorer $restorer,
        private StateTypes $types,
        private StateMethods $methods,
    ) {}

    /**
     * @return list<StackTarget>
     */
    public function listeningTo(Event $event): array
    {
        $listening = array_filter(
            $this->types->registry()->types(),
            fn (RegisteredStateType $type) => $this->methods->methodFor($type->stateClass, $event)->isDefined(),
        );

        $typeKeys = array_values(array_map(fn (RegisteredStateType $type) => $type->key, $listening));

        if ($typeKeys === []) {
            return [];
        }

        return AgentStackRow::targetsHolding($typeKeys);
    }

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
