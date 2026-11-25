<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use LogicException;

/**
 * A test asked its seed for a row it never seeded.
 */
final class SeedMissing extends LogicException
{
    public static function owner(): self
    {
        return new self('The seed has no owner: call owner() first.');
    }

    public static function named(string $kind, string $name): self
    {
        return new self("The seed has no {$kind} called {$name}.");
    }
}
