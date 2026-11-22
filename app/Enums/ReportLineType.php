<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How a line of a command report is printed: as a line, as an error, or as output written as it came.
 */
enum ReportLineType: string
{
    case Line = 'line';
    case Error = 'error';
    case Output = 'output';
}
