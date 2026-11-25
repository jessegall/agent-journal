<?php

declare(strict_types=1);

namespace App\Data\Profiles;

use Spatie\LaravelData\Data;

/**
 * One named read a profile holds: the read's name and the one target it covers, or every target when none is named.
 */
final class ScopedRead extends Data
{
    public function __construct(public readonly string $name, public readonly string|null $target = null) {}

    public function covers(string $name, string|null $target): bool
    {
        return $this->name === $name && ($this->target === null || $this->target === $target);
    }
}
