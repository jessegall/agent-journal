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

    /**
     * @return list<string>
     */
    public static function terminalValues(): array
    {
        return [self::Merged->value, self::Refused->value, self::Uncertain->value];
    }

    public function isTerminal(): bool
    {
        return match ($this) {
            self::Merged, self::Refused, self::Uncertain => true,
            self::Prepared, self::Applying => false,
        };
    }
}
