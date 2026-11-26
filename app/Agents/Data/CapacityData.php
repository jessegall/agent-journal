<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Whether a start would fit the host now, or which resource it lacks, in the words of the capacity refusal.
 */
#[TypeScript]
final class CapacityData extends Data
{
    public function __construct(
        public readonly bool $fits,
        public readonly string|Optional $resource,
        public readonly string|Optional $explanation,
        public readonly string|Optional $remedy,
    ) {}
}
