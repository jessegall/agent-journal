<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Data;

/**
 * One setting of a runtime in its three states: what was asked for, what the host has staged and what the program
 * was last seen using. Only the observed value is in effect.
 */
final class RuntimeSetting extends Data
{
    public function __construct(
        public readonly string|null $requested,
        public readonly string|null $staged,
        public readonly string|null $observed,
        public readonly int|null $observedAgeSeconds,
    ) {}
}
