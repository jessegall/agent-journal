<?php

declare(strict_types=1);

namespace App\Scripts\Values;

use Spatie\LaravelData\Data;

/**
 * Where a trigger's handler goes when it runs off its end, when a step fails and when it returns to the actor.
 */
final class TriggerPolicy extends Data
{
    public function __construct(
        public readonly string $fallthrough,
        public readonly string $failure,
        public readonly string $returnToActor,
    ) {}
}
