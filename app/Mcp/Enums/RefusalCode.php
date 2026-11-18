<?php

declare(strict_types=1);

namespace App\Mcp\Enums;

/**
 * The code an MCP caller reads from a refused call, to choose its recovery.
 */
enum RefusalCode: string
{
    case InvalidInput = 'invalid_input';
    case Unauthenticated = 'unauthenticated';
    case Forbidden = 'forbidden';
    case RecordUnavailable = 'record_unavailable';
    case StateBlocked = 'state_blocked';
    case Conflict = 'conflict';
    case RequestKeyConflict = 'request_key_conflict';
    case StaleContinuation = 'stale_continuation';
    case Busy = 'busy';
    case Unavailable = 'unavailable';
    case Cancelled = 'cancelled';
    case DeadlineExpired = 'deadline_expired';
    case OutcomeUnknown = 'outcome_unknown';
    case UnsupportedVersion = 'unsupported_version';

    /**
     * Whether the same call may succeed when it is sent again unchanged a little later.
     */
    public function isRetryable(): bool
    {
        return match ($this) {
            self::Busy, self::Unavailable, self::DeadlineExpired => true,
            default => false,
        };
    }
}
