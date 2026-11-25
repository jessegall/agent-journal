<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Contracts\Time\ServerClock;
use App\Support\References\StateReference;
use App\Support\Stack\Contracts\StateFactory as StateFactoryContract;
use App\Support\Stack\Frames\Frame;
use App\Support\StateLoading\StateBuilder;
use Illuminate\Support\Str;

/**
 * Builds a new frame for a pushed state from the registered state types and the first values its reference carries,
 * under a new frame id, entering at the server time of the push.
 */
final readonly class StateFactory implements StateFactoryContract
{
    public function __construct(
        private StateTypes $types,
        private ServerClock $clock,
        private StateBuilder $builder,
    ) {}

    public function frameFor(StateReference $reference): Frame
    {
        $type = $this->types->registry()->get($reference->typeKey);

        return new Frame(
            (string) Str::ulid(),
            $reference,
            $this->builder->build($type, $reference->values),
            $this->clock->now(),
            schemaVersion: $type->schemaVersion,
        );
    }

    public function isEnabled(StateReference $reference): bool
    {
        $type = $this->types->registry()->get($reference->typeKey);

        return $type->isEnabled();
    }
}
