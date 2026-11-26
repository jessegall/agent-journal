<?php

declare(strict_types=1);

namespace App\Records\Values;

/**
 * How far a record got, as a count of finished steps out of all of them.
 */
final readonly class SummaryProgress
{
    public function __construct(public int $finished, public int $total) {}
}
