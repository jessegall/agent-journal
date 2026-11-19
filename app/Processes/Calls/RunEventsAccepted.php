<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use Spatie\LaravelData\Data;

/**
 * How many events of a batch the journal took.
 */
final class RunEventsAccepted extends Data
{
    public function __construct(public readonly int $accepted) {}
}
