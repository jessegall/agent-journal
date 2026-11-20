<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where one merge of approved work stands: prepared, applying its git effect, merged, refused with the target left
 * as it was, or uncertain because the effect cannot be proven either way.
 */
enum MergeAttemptState: string
{
    case Prepared = 'prepared';
    case Applying = 'applying';
    case Merged = 'merged';
    case Refused = 'refused';
    case Uncertain = 'uncertain';

    public function isTerminal(): bool
    {
        return match ($this) {
            self::Merged, self::Refused, self::Uncertain => true,
            self::Prepared, self::Applying => false,
        };
    }
}
