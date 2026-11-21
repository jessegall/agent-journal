<?php

declare(strict_types=1);

namespace App\Http\Data\Connections;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One environment a Join line can land in, by its id and label.
 */
#[TypeScript]
final class EnvironmentOptionData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $label,
    ) {}
}
