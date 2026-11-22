<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How far a claim about a pinned driver is shown: its contract tests pass, the real driver showed it, or what
 * showing it needs is still missing. Only what the real driver showed may let an agent start.
 */
enum DriverEvidence: string
{
    case ContractPassed = 'contract-passed';
    case NativeShown = 'native-shown';
    case PrerequisiteMissing = 'prerequisite-missing';

    public function isNativeShown(): bool
    {
        return $this === self::NativeShown;
    }
}
