<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Time\ServerClock;
use App\Contracts\Work\ConditionalStateType;
use App\Support\Decisions\StateReferences;
use App\Support\References\StateReference;
use App\Support\Stack\Contracts\StateFactory;
use App\Support\Stack\Frames\Frame;
use App\Values\StackTarget;
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
