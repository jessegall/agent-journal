<?php

declare(strict_types=1);

namespace Tests\Fixtures\SingleImplementations\Contracts;

/**
 * A contract one class implements under another name.
 */
interface Clock
{
    public function now(): int;
}
