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
    case Verifying = 'verifying';
    case Unverified = 'unverified';

    /**
     * Whether a start ended without a session: refused, no capacity for it, or its account must sign in first.
     */
    public function isStartRefused(): bool
    {
        return in_array($this, [self::Refused, self::NoCapacity, self::WaitingForSignIn], true);
    }

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
            self::Verifying => 'Verifying session',
            self::Unverified => 'Session not verified',
        };
    }

    /**
     * The sentence under a state that needs one to be understood, or none.
     */
    public function reason(): string|null
    {
        return match ($this) {
            self::Verifying => 'The journal is checking which conversation the agent runs before it sends your messages.',
            self::Unverified => 'The journal could not confirm which conversation the agent runs, so your messages stay held.',
            self::Stopped,
            self::Starting,
            self::Working,
            self::Idle,
            self::Stopping,
            self::Interrupting,
            self::Failed,
            self::Refused,
            self::WaitingForSignIn,
            self::NoCapacity,
            self::Unknown,
            self::Retired => null,
        };
    }
}
