<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

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

    /**
     * The failure an endpoint status means; no status, a timeout or a server error is an outage.
     */
    public static function fromStatus(int|null $status): self
    {
        return match ($status) {
            401, 403 => self::Unauthorized,
            409 => self::Conflict,
            422 => self::Unreadable,
            default => self::Unreachable,
        };
    }

    public function isOutage(): bool
    {
        return match ($this) {
            self::Unreachable => true,
            self::Unauthorized, self::Conflict, self::Unreadable => false,
        };
    }
}
