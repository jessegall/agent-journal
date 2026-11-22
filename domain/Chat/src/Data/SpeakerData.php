<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Who wrote one chat row: the actor as type:id, its name and, for an agent, the driver it runs through.
 */
#[TypeScript]
final class SpeakerData extends Data
{
    public function __construct(
        public readonly string $actor,
        public readonly string $label,
        public readonly string|null $driver,
    ) {}
}
