<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where one process start of a start stands: registered and waiting for its host, claimed by the host and being
 * started, running, cancelled before any process existed, or stopped with proof that it exited. Only the last two end
 * it; a start whose process identity was never recorded is still unresolved.
 */
enum SessionProcessStatus: string
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
        return [
            self::Pending,
            self::Starting,
            self::Running,
        ];
    }

    /**
     * Whether the process is not running yet: registered and waiting for its host, or claimed and being started.
     */
    public function isStarting(): bool
    {
        return $this === self::Pending || $this === self::Starting;
    }
}
