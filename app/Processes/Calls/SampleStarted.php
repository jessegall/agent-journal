<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The admitted run a sample started.
 */
final class SampleStarted extends Data
{
    public function __construct(
        #[MapName('run_id')]
        public string $runId,
    ) {}
}
