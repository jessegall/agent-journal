<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

/**
 * A service a page pulls from the container; it must never reach the browser.
 */
final class ShelfCounter
{
    public function count(string $shelf): int
    {
        return strlen($shelf);
    }
}
