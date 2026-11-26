<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\CommandRules\Enums\Outcome;

/**
 * What an assessment concludes about a whole check run: no result, passed, findings, or an empty run its contract
 * allows; an execution error is no result. Outcome judges one exit of a check instead.
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
