<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The answer to an admitted line: the run it admitted.
 */
final class LineAdmitted extends Data
{
    public function __construct(
        #[MapName('run_id')]
        public string $runId,
    ) {}
}
