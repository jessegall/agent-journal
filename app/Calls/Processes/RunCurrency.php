<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * Whether a running run's rules still hold: the reason it went stale, empty while it is current.
 */
final class RunCurrency extends Data
{
    public function __construct(
        #[MapName('stale_reason')]
        public string $staleReason,
    ) {}
}
