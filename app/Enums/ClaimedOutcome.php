<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What a check's output claims about its run, read from its summary; the claim is never a result by itself.
 */
enum ClaimedOutcome: string
{
    case Passed = 'passed';
    case Failed = 'failed';
    case Unknown = 'unknown';
}
