<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

/**
 * A factory with a newInstance method of its own, which is no reflection.
 */
final class RawReflectionFactory
{
    public function newInstance(): self
    {
        return new self();
    }
}
