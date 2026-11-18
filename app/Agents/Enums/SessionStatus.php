<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where a launched session stands: active while it sends heartbeats, silent when they stop for a while (it still
 * counts as running), timed out when the silence lasts past the second limit, and ended when its program ended.
 */
enum SessionStatus: string
{
    case Active = 'active';
    case Silent = 'silent';
    case TimedOut = 'timed_out';
    case Ended = 'ended';

    /**
     * Whether the session may still act: active, or silent for a while.
     */
    public function isRunning(): bool
    {
        return match ($this) {
            self::Active, self::Silent => true,
            self::TimedOut, self::Ended => false,
        };
    }
}
