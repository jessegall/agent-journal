<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations;

use Tests\Fixtures\SingleImplementations\Contracts\Store;

/**
 * The other of two stores.
 */
final class FileStore implements Store
{
    public function keep(string $value): void {}
}
