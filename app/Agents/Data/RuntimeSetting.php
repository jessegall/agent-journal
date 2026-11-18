<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One setting of a runtime in its three states: what was asked for, what the host has staged and what the program
 * was last seen using. Only the observed value is in effect.
 */
#[TypeScript]
final class RuntimeSetting extends Data
{
    public function __construct(
        public readonly string|Optional $requested = new Optional(),
        public readonly string|Optional $staged = new Optional(),
        public readonly string|Optional $observed = new Optional(),
        public readonly int|Optional $observedAgeSeconds = new Optional(),
    ) {}
}
