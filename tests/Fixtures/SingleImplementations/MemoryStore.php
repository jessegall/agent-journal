<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations;

use Tests\Fixtures\SingleImplementations\Contracts\Store;

/**
 * One of two stores.
 */
final class MemoryStore implements Store
{
    public function keep(string $value): void {}
}
