<?php

declare(strict_types=1);

namespace App\Support\StateEvents;

use App\Contracts\Events\Event;
use App\Declarations\StateMethods;
use App\Models\Agents\AgentStackRow;
use App\Support\StateCatalog\Contracts\StateTypes;
use App\Support\StateLoading\RegisteredStateType;
use App\Values\StackTarget;

/**
 * The stacks a fact reaches because one of their states listens for it: every active stack, of any agent, that holds
 * a frame of a state type with a listener for the fact.
 */
final readonly class ListeningStacks
{
    public function __construct(private StateTypes $types, private StateMethods $methods) {}

    /**
     * @return list<StackTarget>
     */
    public function of(Event $event): array
    {
        $listening = array_filter(
            $this->types->registry()->types(),
            fn (RegisteredStateType $type) => $this->listens($type, $event),
        );

        $typeKeys = array_values(array_map(fn (RegisteredStateType $type) => $type->key, $listening));

        return $typeKeys === [] ? [] : AgentStackRow::targetsHolding($typeKeys);
    }

    private function listens(RegisteredStateType $type, Event $event): bool
    {
        return $this->methods->methodFor($type->stateClass, $event)->isDefined();
    }
}
