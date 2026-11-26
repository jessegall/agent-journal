<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

use App\Processes\Enums\Tone;
use App\Records\Values\RecordStanding;

/**
 * Whether a record still asks for attention, or was settled as needing none.
 */
enum AttentionStatus: string
{
    case Active = 'active';
    case Settled = 'settled';

    /**
     * The state as a record's short card shows it.
     */
    public function standing(): RecordStanding
    {
        return match ($this) {
            self::Active => new RecordStanding('Open', Tone::Note),
            self::Settled => new RecordStanding('Closed', Tone::Muted),
        };
    }
}
