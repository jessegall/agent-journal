<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Where a host's key script run stands: the step it confirmed, the screen generation it matched there and a short
 * plain description of what it saw. It never holds a key the script typed.
 */
final readonly class ScriptProgress
{
    public function __construct(
        public int $step,
        public int $generation,
        public string $evidence,
    ) {}
}
