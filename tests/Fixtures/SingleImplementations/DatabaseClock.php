<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations;

use Tests\Fixtures\SingleImplementations\Contracts\Clock;

/**
 * The only clock, named for how it tells the time instead of for its contract.
 */
final readonly class DatabaseClock implements Clock
{
    public function now(): int
    {
        return 0;
    }
}
