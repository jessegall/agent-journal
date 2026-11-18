<?php

declare(strict_types=1);

namespace Tests\Fixtures\Pipelines;

/**
 * A fixture stage: a number that has been counted.
 */
final readonly class Counted
{
    public function __construct(public int $count) {}
}
