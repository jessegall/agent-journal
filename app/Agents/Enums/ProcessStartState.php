<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where one process start of a launch stands: registered and waiting for its host, claimed by the host and being
 * started, running, cancelled before any process existed, or stopped with proof that it exited. Only the last two end
 * it; a start whose process identity was never recorded is still unresolved.
 */
enum ProcessStartState: string
{
    case Pending = 'pending';
    case Starting = 'starting';
    case Running = 'running';
    case Cancelled = 'cancelled';
    case Stopped = 'stopped';

    /**
     * The states of a start that may still have, or still make, a process using its account.
     *
     * @return list<self>
     */
    public static function unresolved(): array
    {
        return [self::Pending, self::Starting, self::Running];
    }
}
