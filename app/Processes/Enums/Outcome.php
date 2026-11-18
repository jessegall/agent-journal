<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What one exit of a check means, judged with its output evidence.
 */
enum Outcome: string
{
    case Passed = 'passed';
    case Findings = 'findings';
    case ExecutionError = 'execution_error';

    /**
     * Whether a reader's claimed outcome fits this exit branch: a pass claims a pass, findings claim failures, and an
     * execution error never claims a pass.
     */
    public function acceptsClaim(ClaimedOutcome $claimed): bool
    {
        return match ($this) {
            self::Passed => $claimed === ClaimedOutcome::Passed,
            self::Findings => $claimed === ClaimedOutcome::Failed,
            self::ExecutionError => $claimed !== ClaimedOutcome::Passed,
        };
    }
}
