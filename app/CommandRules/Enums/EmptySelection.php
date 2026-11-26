<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

/**
 * What zero eligible items means: an allowed empty run, or a configuration problem.
 */
enum EmptySelection: string
{
    case AllowedEmpty = 'allowed_empty';
    case ConfigurationProblem = 'configuration_problem';
}
