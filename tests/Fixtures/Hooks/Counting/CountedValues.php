<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Counting;

use Spatie\LaravelData\Data;

/**
 * The counting state's own value: how many times it counted.
 */
final class CountedValues extends Data
{
    public function __construct(public readonly int $count = 0) {}
}
