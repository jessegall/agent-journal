<?php

declare(strict_types=1);

namespace App\Processes\Calls;

use App\Processes\Enums\AdmissionState;
use App\Processes\Enums\ShellDialect;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * The answer to fetching an admission: a run to start, with its execution material, or one another request started.
 */
final class AdmissionFetched extends Data
{
    /**
     * @param  array{root: array<string, mixed>, tree_digest: string}|null  $plan
     */
    public function __construct(
        public AdmissionState $state,
        #[MapName('run_id')]
        public string $runId,
        #[MapName('event_key')]
        public string|null $eventKey = null,
        public ShellDialect|null $dialect = null,
        #[MapName('working_folder')]
        public string|null $workingFolder = null,
        #[MapName('tree_digest')]
        public string|null $treeDigest = null,
        public array|null $plan = null,
    ) {}
}
