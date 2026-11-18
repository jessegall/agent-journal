<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Actors\Contracts\ServerClock;
use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\StateFactory;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
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
    ) {}

    public function frameFor(StateReference $reference): Frame
    {
        $type = $this->types->registry()->get($reference->typeKey);

        return new Frame(
            (string) Str::ulid(),
            $reference,
            $type->statesFor(new StateReferences([$reference]))->stateAt(0),
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
