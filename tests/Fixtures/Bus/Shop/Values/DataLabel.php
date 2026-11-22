<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bus\Shop\Values;

use Spatie\LaravelData\Data;

/**
 * A Data value a command carries: the class is not readonly, but every property it declares is.
 */
final class DataLabel extends Data
{
    public function __construct(public readonly string $text) {}
}
