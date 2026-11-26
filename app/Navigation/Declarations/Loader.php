<?php

declare(strict_types=1);

namespace App\Navigation\Declarations;

/**
 * A read a page offers beside its own result, keyed within its owner and answered by an invokable reader that takes one
 * input Data and returns one answer Data; the browser calls it by a partial reload of the page it is on.
 */
final readonly class Loader
{
    /**
     * @param  class-string  $reader
     */
    private function __construct(public string $name, public string $reader) {}

    /**
     * @param  class-string  $reader
     */
    public static function make(string $name, string $reader): self
    {
        return new self($name, $reader);
    }
}
