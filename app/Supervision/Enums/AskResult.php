<?php

declare(strict_types=1);

namespace App\Supervision\Enums;

use App\Agents\Models\MergeAttempt;
use App\Supervision\Models\Ask;

/**
 * Where an ask stands for its reader: still open, merged on a merged attempt's evidence, or settled.
 */
enum AskResult: string
{
    case Open = 'open';
    case Merged = 'merged';
    case Settled = 'settled';

    public static function of(Ask $ask): self
    {
        return match (true) {
            $ask->open => self::Open,
            MergeAttempt::hasMerged($ask->id) => self::Merged,
            default => self::Settled,
        };
    }

    /**
     * The word a reader sees for it.
     */
    public function label(): string
    {
        return match ($this) {
            self::Open => 'Open',
            self::Merged => 'Merged',
            self::Settled => 'Settled',
        };
    }
}
