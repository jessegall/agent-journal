<?php

declare(strict_types=1);

namespace App\Core\Hooks\Stack;

use App\Core\Hooks\Decisions\StateReference;
use Illuminate\Support\Str;

/**
 * Builds a new frame for a pushed state from the registered state types, under a new frame id.
 */
final readonly class RegisteredStateFactory implements StateFactory
{
    public function __construct(private StateTypes $types) {}

    public function frameFor(StateReference $reference): Frame
    {
        $type = $this->types->registry()->get($reference->typeKey);

        return new Frame((string) Str::ulid(), $reference, $type->stateFor($reference), schemaVersion: $type->schemaVersion());
    }
}
