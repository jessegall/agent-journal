<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use App\Bus\Enums\RefusalCode;

/**
 * Why a terminal view was refused.
 */
enum TerminalViewRefusal: string
{
    case MayNotInspect = 'may_not_inspect';
    case ProcessDriver = 'process_driver';
    case NotRunning = 'not_running';
    case TooManyViews = 'too_many_views';
    case Interval = 'interval';

    /**
     * The code a caller reads from the refusal, which also gives its HTTP status.
     */
    public function code(): RefusalCode
    {
        return match ($this) {
            self::MayNotInspect => RefusalCode::Forbidden,
            self::NotRunning => RefusalCode::StateBlocked,
            self::ProcessDriver, self::Interval => RefusalCode::InvalidInput,
            self::TooManyViews => RefusalCode::Busy,
        };
    }
}
