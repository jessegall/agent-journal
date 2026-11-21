<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Where a switch of an agent's driver session stands, from the request to a confirmed new session or its end.
 */
enum DriverSwitchStage: string
{
    case Requested = 'requested';
    case Preflighted = 'preflighted';
    case Refused = 'refused';
    case Stopping = 'stopping';
    case StopUnconfirmed = 'stop_unconfirmed';
    case Stopped = 'stopped';
    case Starting = 'starting';
    case StartUnconfirmed = 'start_unconfirmed';
    case Confirmed = 'confirmed';
    case LaunchFailed = 'launch_failed';
    case Cancelled = 'cancelled';

    /**
     * Whether the switch has ended; the final stages are left out of the one-open-switch index.
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::Refused, self::Confirmed, self::LaunchFailed, self::Cancelled], true);
    }

    /**
     * Whether no new writer may start while the switch stands here: the old process may still run, or the new one
     * may already.
     */
    public function blocksWriter(): bool
    {
        return in_array($this, [self::Stopping, self::StopUnconfirmed, self::Starting, self::StartUnconfirmed], true);
    }

    public function mayMoveTo(self $next): bool
    {
        return in_array($next, $this->followers(), true);
    }

    /**
     * @return list<self>
     */
    private function followers(): array
    {
        return match ($this) {
            self::Requested => [self::Preflighted, self::Refused, self::Cancelled],
            self::Preflighted => [self::Stopping, self::Cancelled],
            self::Stopping => [self::Stopped, self::StopUnconfirmed],
            self::StopUnconfirmed => [self::Stopped, self::Cancelled],
            self::Stopped => [self::Starting, self::LaunchFailed, self::Cancelled],
            self::Starting => [self::Confirmed, self::StartUnconfirmed, self::LaunchFailed],
            self::StartUnconfirmed => [self::Confirmed, self::LaunchFailed],
            self::LaunchFailed => [self::Stopped],
            self::Refused, self::Confirmed, self::Cancelled => [],
        };
    }
}
