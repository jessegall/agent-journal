<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The evidence permit an approved sample issued.
 */
final class SampleApproved extends Data
{
    public function __construct(
        #[MapName('permit_id')]
        public string $permitId,
    ) {}
}
