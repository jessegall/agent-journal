<?php

declare(strict_types=1);

namespace App\Terminals\Enums;

use App\Engine\Enums\RefusalCode;

/**
 * Why a terminal view was refused.
 */
enum TerminalViewRefusal: string
{
    case MayNotInspect = 'may_not_inspect';
    case ProcessDriver = 'process_driver';
    case NotRunning = 'not_running';
    case TooManyViews = 'too_many_views';
    case UnsupportedInterval = 'interval';
    case UnknownInterest = 'unknown_interest';
    case InterestEnded = 'interest_ended';

    /**
     * The code a caller reads from the refusal, which also gives its HTTP status.
     */
    public function code(): RefusalCode
    {
        return match ($this) {
            self::MayNotInspect => RefusalCode::Forbidden,
            self::NotRunning => RefusalCode::StateBlocked,
            self::ProcessDriver, self::UnsupportedInterval => RefusalCode::InvalidInput,
            self::TooManyViews => RefusalCode::Busy,
            self::UnknownInterest => RefusalCode::RecordUnavailable,
            self::InterestEnded => RefusalCode::StateBlocked,
        };
    }
}
