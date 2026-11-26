<?php

declare(strict_types=1);

namespace App\Values;

/**
 * How a driver keeps one boundary item from its tools on a platform, or why it cannot.
 */
final readonly class BoundaryMechanism
{
    private function __construct(public bool $isNative, public string $text) {}

    public static function native(string $how): self
    {
        return new self(true, $how);
    }

    public static function unavailable(string $why): self
    {
        return new self(false, $why);
    }
}
