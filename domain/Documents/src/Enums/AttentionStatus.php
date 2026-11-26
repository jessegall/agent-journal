<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

use App\Processes\Cards\StateLabel;
use App\Processes\Enums\Tone;

/**
 * Whether a record still asks for attention, or was settled as needing none.
 */
enum AttentionStatus: string
{
    case Active = 'active';
    case Settled = 'settled';

    /**
     * The state as a docked card shows it.
     */
    public function stateLabel(): StateLabel
    {
        return match ($this) {
            self::Active => new StateLabel('state', 'Open', Tone::Note),
            self::Settled => new StateLabel('state', 'Closed', Tone::Muted),
        };
    }
}
