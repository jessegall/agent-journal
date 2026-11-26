<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

/**
 * How much one evidence sample may capture and run, and how long its permit stays usable.
 */
final readonly class PermitLimits
{
    public function __construct(public int $byteCap, public int $secondsCap, public int $minutesValid) {}

    /**
     * The limits an owner's approval of a request's sample gives.
     */
    public static function forSample(): self
    {
        return new self(104_857_600, 600, 60);
    }
}
