<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Processes\ShellDialect;
use App\Enums\Runs\RunMode;
use App\Enums\Runs\RunRequestIntent;

/**
 * What a run is admitted with: its key, mode, project, the line's digest and dialect, the rule and policy revisions it
 * was judged under, the folder it runs in, its execution plan, why it was asked for and the user a request on an
 * agent's behalf entitles to its outcome.
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
        public RunRequestIntent $intent = RunRequestIntent::ExplicitRequest,
        // The user a request made on an agent's behalf entitles to the run's outcome, when it names one.
        public string|null $outcomeUserId = null,
    ) {}
}
