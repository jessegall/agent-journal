<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * One trigger's handler in a compiled script: the instruction it starts at, its policy and where it stands in the
 * source.
 */
final class ScriptHandler extends Data
{
    public function __construct(
        public readonly string $entry,
        public readonly TriggerPolicy $policy,
        public readonly ScriptRange $source,
    ) {}
}
