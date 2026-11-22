<?php

declare(strict_types=1);

namespace App\Support;

/**
 * What came of asking an actor for attention: a wake its runtime accepted, or no runtime to wake.
 */
final readonly class AttentionOutcome
{
    private function __construct(public string|null $requestId, public int $sequence) {}

    public static function accepted(string $requestId, int $sequence): self
    {
        return new self($requestId, $sequence);
    }

    public static function noRuntime(): self
    {
        return new self(null, 0);
    }
}
