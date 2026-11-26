<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\CommandRules\Enums\Outcome;

/**
 * What an assessment concludes about a check's run: no result, passed, findings, or an empty run its contract allows.
 * An execution error is never findings: it is a problem with no result.
 * It is not Outcome: Outcome judges one exit of a check, and an assessment of the whole run adds an allowed empty run
 * and turns an execution error into no result.
 */
enum AssessmentOutcome: string
{
    case Unavailable = 'unavailable';
    case Passed = 'passed';
    case Findings = 'findings';
    case AllowedEmpty = 'allowed_empty';

    public static function of(Outcome $outcome): self
    {
        return match ($outcome) {
            Outcome::Passed => self::Passed,
            Outcome::Findings => self::Findings,
            Outcome::ExecutionError => self::Unavailable,
        };
    }
}
