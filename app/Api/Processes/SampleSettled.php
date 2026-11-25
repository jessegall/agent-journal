<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * Where a held command stands once its sample run ended, and the exit statuses it never saw.
 */
final class SampleSettled extends Data
{
    /**
     * @param  list<int>  $unsampledStatuses
     */
    public function __construct(
        public string $state,
        #[MapName('run_id')]
        public string $runId,
        #[MapName('unsampled_statuses')]
        public array $unsampledStatuses,
    ) {}
}
