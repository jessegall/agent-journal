<?php

declare(strict_types=1);

namespace App\Enums\Asks;

use App\Models\Asks\Ask;

/**
 * Where an ask stands for its reader: still open, or settled.
 */
enum AskResult: string
{
    case Open = 'open';
    case Settled = 'settled';

    public static function of(Ask $ask): self
    {
        if ($ask->open) {
            return self::Open;
        }

        return self::Settled;
    }

    /**
     * The word a reader sees for it.
     */
    public function label(): string
    {
        return match ($this) {
            self::Open => 'Open',
            self::Settled => 'Settled',
        };
    }
}
