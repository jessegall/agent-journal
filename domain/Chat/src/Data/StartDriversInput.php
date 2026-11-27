<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The agent whose start form reads the drivers it may start on.
 */
#[TypeScript]
final class StartDriversInput extends Data
{
    public function __construct(
        #[Ulid]
        public readonly string $agent,
    ) {}
}
