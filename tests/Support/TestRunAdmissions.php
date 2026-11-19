<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Processes\Enums\RunMode;
use App\Processes\Enums\ShellDialect;
use App\Processes\Enums\StepType;
use App\Processes\Values\ExecutionPlan;
use App\Processes\Values\PlanStep;
use App\Processes\Values\RunAdmission;

/**
 * Admissions for tests that store a run: the given plan and line, or an empty plan under fixed test digests.
 */
final class TestRunAdmissions
{
    public static function of(
        string $admissionId = '',
        RunMode $mode = RunMode::Normal,
        string $projectKey = 'project',
        string $line = '',
        ExecutionPlan|null $plan = null,
        string $workingFolder = '',
    ): RunAdmission {
        return new RunAdmission(
            $admissionId === '' ? bin2hex(random_bytes(8)) : $admissionId,
            $mode,
            $projectKey,
            $line === '' ? str_repeat('a', 64) : hash('sha256', $line),
            ShellDialect::Bash,
            'rules-1',
            'policy-1',
            $workingFolder,
            $plan ?? new ExecutionPlan(new PlanStep(StepType::Sequence, 0, 0), str_repeat('b', 64)),
        );
    }
}
