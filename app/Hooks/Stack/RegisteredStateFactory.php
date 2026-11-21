<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Actors\Contracts\ServerClock;
use App\Agents\Values\StackTarget;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Stack\Contracts\StateFactory;
use Illuminate\Support\Str;

/**
 * Builds a new frame for a pushed state from the registered state types, under a new frame id, entering at the server
 * time of the push.
 */
final readonly class RegisteredStateFactory implements StateFactory
{
    public function __construct(
        private StateTypes $types,
        private ServerClock $clock,
        private TargetStates $states = new TargetStates(),
    ) {}

    public function frameFor(StateReference $reference, StackTarget $target): Frame
    {
        $type = $this->types->registry()->get($reference->typeKey);

        $states = $this->states->of($type, new StateReferences([$reference]), $target);

        return new Frame(
            (string) Str::ulid(),
            $reference,
            $states->stateOfClassAt(0, $type->stateClass()),
            $this->clock->now(),
            schemaVersion: $type->schemaVersion(),
        );
    }

    public function isEnabled(StateReference $reference): bool
    {
        $type = $this->types->registry()->get($reference->typeKey);

        return ! $type instanceof ConditionalStateType || $type->isEnabled();
    }
}
