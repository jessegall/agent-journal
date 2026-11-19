<?php

declare(strict_types=1);

namespace Tests\Fixtures\SignedCalls;

use Spatie\LaravelData\Data;

/**
 * An answer no planted call declares.
 */
final class PlantedAnswer extends Data
{
    public function __construct(public readonly string $text) {}
}
