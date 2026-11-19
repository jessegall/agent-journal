<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\RunMode;
use App\Processes\Enums\ShellDialect;

/**
 * What a run is admitted with: its key, mode, project, the line's digest and dialect, the rule and policy revisions it
 * was judged under, the folder it runs in and its execution plan.
 */
final readonly class RunAdmission
{
    public function __construct(
        public string $admissionId,
        public RunMode $mode,
        public string $projectKey,
        public string $sourceDigest,
        public ShellDialect $dialect,
        public string $registryRevision,
        public string $policyRevision,
        public string $workingFolder,
        public ExecutionPlan $plan,
    ) {}
}
