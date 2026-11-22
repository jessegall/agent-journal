<?php

declare(strict_types=1);

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the evidence says an agent's session is doing now; Unknown when the evidence cannot say.
 */
#[TypeScript]
enum SessionState: string
{
    case Stopped = 'stopped';
    case Starting = 'starting';
    case Working = 'working';
    case Idle = 'idle';
    case Stopping = 'stopping';
    case Interrupting = 'interrupting';
    case Failed = 'failed';
    case Refused = 'refused';
    case WaitingForSignIn = 'waiting-for-sign-in';
    case NoCapacity = 'no-capacity';
    case Unknown = 'unknown';
    case Retired = 'retired';

    /**
     * The words the bar shows for this state when nothing more specific names it.
     */
    public function label(): string
    {
        return match ($this) {
            self::Stopped => 'Stopped',
            self::Starting => 'Starting',
            self::Working => 'Working',
            self::Idle => 'Idle',
            self::Stopping => 'Stopping',
            self::Interrupting => 'Interrupting',
            self::Failed => 'Failed',
            self::Refused => 'Start refused',
            self::WaitingForSignIn => 'Waiting for sign-in',
            self::NoCapacity => 'No capacity',
            self::Unknown => 'Status unknown',
            self::Retired => 'Retired',
        };
    }
}
