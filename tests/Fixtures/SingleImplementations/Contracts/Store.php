<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations\Contracts;

/**
 * A contract two classes implement, so each keeps a name that tells them apart.
 */
interface Store
{
    public function keep(string $value): void;
}
