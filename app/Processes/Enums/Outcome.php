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
}
