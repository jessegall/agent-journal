<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Which sources one search covers: every eligible source, or the one whose qualified key the caller chose.
 */
final readonly class SearchScope
{
    private function __construct(public string|null $within) {}

    public static function everywhere(): self
    {
        return new self(null);
    }

    public static function within(string $qualifiedKey): self
    {
        return new self($qualifiedKey);
    }

    public function isEverywhere(): bool
    {
        return $this->within === null;
    }

    public function covers(string $qualifiedKey): bool
    {
        return $this->within === null || $this->within === $qualifiedKey;
    }
}
