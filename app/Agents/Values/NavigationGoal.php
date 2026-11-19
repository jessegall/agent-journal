<?php

declare(strict_types=1);

namespace App\Agents\Values;

use Spatie\LaravelData\Data;

/**
 * What a navigation request is for: the key script with its version and parameters, such as ChangeEffort effort=low.
 */
final class NavigationGoal extends Data
{
    /**
     * @param  array<string, string>  $parameters
     */
    public function __construct(
        public readonly string $script,
        public readonly int $version,
        public readonly array $parameters,
    ) {}
}
