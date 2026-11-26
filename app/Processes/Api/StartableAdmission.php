<?php

declare(strict_types=1);

namespace App\Processes\Api;

use App\Processes\Enums\AdmissionStatus;
use App\Processes\Enums\ShellDialect;
use App\Values\ExecutionPlan;
use Spatie\LaravelData\Attributes\MapName;

/**
 * An admitted run for the caller to start: its event key, how and where it runs, and the plan it was admitted with.
 */
final class StartableAdmission extends AdmissionFetched
{
    public function __construct(
        #[MapName('run_id')]
        public readonly string $runId,
        #[MapName('event_key')]
        public readonly string $eventKey,
        public readonly ShellDialect $dialect,
        #[MapName('working_folder')]
        public readonly string $workingFolder,
        #[MapName('tree_digest')]
        public readonly string $treeDigest,
        public readonly ExecutionPlan $plan,
    ) {
        $this->status = AdmissionStatus::ToRun;
    }
}
