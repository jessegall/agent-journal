<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a started session stands: active while it sends heartbeats, silent when they stop for a while (it still
 * counts as running, only absent), and ended when its driver ended or its agent retired.
 */
enum SessionStatus: string
{
    case Active = 'active';
    case Silent = 'silent';
    case Ended = 'ended';

    /**
     * The statuses of a session that is still running.
     *
     * @return list<self>
     */
    public static function running(): array
    {
        return array_values(array_filter(self::cases(), fn (self $status) => $status->isRunning()));
    }

    /**
     * Whether the session may still act: active, or silent for a while.
     */
    public function isRunning(): bool
    {
        return match ($this) {
            self::Active, self::Silent => true,
            self::Ended => false,
        };
    }
}
