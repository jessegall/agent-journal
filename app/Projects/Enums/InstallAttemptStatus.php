<?php

declare(strict_types=1);

namespace App\Projects\Enums;

/**
 * Where an owner's attempt to install a line stands: open with a live or expired line, cancelled, or spent on a
 * binding. Expired is read from the open attempt's line, never stored.
 */
enum InstallAttemptStatus: string
{
    case Open = 'open';
    case Expired = 'expired';
    case Cancelled = 'cancelled';
    case Spent = 'spent';

    /**
     * Whether nothing changes the attempt any more.
     */
    public function isTerminal(): bool
    {
        return $this !== self::Open;
    }
}
