<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How a hook call to the journal failed, as the host sees it. Only an outage may fall back to a neutral reply;
 * a refused credential, a changed retry or an unreadable payload is the journal answering, not the journal being away.
 */
enum CallFailure: string
{
    case Unreachable = 'unreachable';
    case Unauthorized = 'unauthorized';
    case Conflict = 'conflict';
    case Unreadable = 'unreadable';
    case Refused = 'refused';

    /**
     * The failure an endpoint status means: only no status or a gateway's 502 or 504 is an outage; any other status is
     * the journal's own answer and is passed on, never bypassed.
     */
    public static function fromStatus(int|null $status): self
    {
        return match ($status) {
            null, 502, 504 => self::Unreachable,
            401, 403 => self::Unauthorized,
            409 => self::Conflict,
            422 => self::Unreadable,
            default => self::Refused,
        };
    }

    public function isOutage(): bool
    {
        return match ($this) {
            self::Unreachable => true,
            self::Unauthorized, self::Conflict, self::Unreadable, self::Refused => false,
        };
    }
}
