<?php

declare(strict_types=1);

namespace App\Terminals\Enums;

use App\Engine\Enums\RefusalCode;

/**
 * Why taking or using control of a terminal was refused.
 */
enum TerminalControlRefusal: string
{
    case InspectOnly = 'inspect_only';
    case WatchOnly = 'watch_only';
    case ControlHeld = 'control_held';
    case GrantEnded = 'grant_ended';
    case UnknownTake = 'unknown_take';
    case SequenceGap = 'sequence_gap';
    case PasteTooLarge = 'paste_too_large';

    /**
     * The code a caller reads from the refusal, which also gives its HTTP status.
     */
    public function code(): RefusalCode
    {
        return match ($this) {
            self::InspectOnly => RefusalCode::Forbidden,
            self::PasteTooLarge => RefusalCode::InvalidInput,
            self::WatchOnly, self::GrantEnded => RefusalCode::StateBlocked,
            self::ControlHeld, self::SequenceGap => RefusalCode::Conflict,
            self::UnknownTake => RefusalCode::RecordUnavailable,
        };
    }
}
