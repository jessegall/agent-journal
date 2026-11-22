<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Whether reviewed work was reopened for its worker, or no domain could reopen it.
 */
enum WorkRepairOutcome: string
{
    case Reopened = 'reopened';
    case Unavailable = 'unavailable';
}
