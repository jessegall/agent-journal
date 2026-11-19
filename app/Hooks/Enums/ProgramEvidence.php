<?php

declare(strict_types=1);

namespace App\Hooks\Enums;

/**
 * How far a claim about a pinned program is shown: its contract tests pass, the real program showed it, or what
 * showing it needs is still missing. Only what the real program showed may let an agent launch.
 */
enum ProgramEvidence: string
{
    case ContractPassed = 'contract-passed';
    case NativeShown = 'native-shown';
    case PrerequisiteMissing = 'prerequisite-missing';

    public function isNativeShown(): bool
    {
        return $this === self::NativeShown;
    }
}
