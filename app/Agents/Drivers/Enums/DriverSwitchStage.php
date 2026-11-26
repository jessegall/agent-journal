<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

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
    case StartFailed = 'start_failed';
    case Cancelled = 'cancelled';

    /**
     * Whether the switch has ended; the final stages are left out of the one-open-switch index.
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::Refused, self::Confirmed, self::StartFailed, self::Cancelled], true);
    }

    /**
     * The words Home shows for where the switch stands.
     */
    public function label(): string
    {
        return match ($this) {
            self::Requested, self::Preflighted => 'Checking the new session',
            self::Refused => 'Refused',
            self::Stopping => 'Stopping the old session',
            self::StopUnconfirmed => 'Waiting for the host to confirm the stop',
            self::Stopped, self::Starting => 'Starting the new session',
            self::StartUnconfirmed => 'Waiting for the host to confirm the start',
            self::Confirmed => 'Switched',
            self::StartFailed => 'The new session failed to start',
            self::Cancelled => 'Cancelled',
        };
    }

    /**
     * Whether the switch waits for the host to confirm its old process stopped or its new one runs.
     */
    public function isUnconfirmed(): bool
    {
        return in_array($this, [self::StopUnconfirmed, self::StartUnconfirmed], true);
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
            self::Requested => [
                self::Preflighted,
                self::Refused,
                self::Cancelled,
            ],
            self::Preflighted => [
                self::Stopping,
                self::Cancelled,
            ],
            self::Stopping => [
                self::Stopped,
                self::StopUnconfirmed,
            ],
            self::StopUnconfirmed => [
                self::Stopped,
                self::Cancelled,
            ],
            self::Stopped => [
                self::Starting,
                self::StartFailed,
                self::Cancelled,
            ],
            self::Starting => [
                self::Confirmed,
                self::StartUnconfirmed,
                self::StartFailed,
            ],
            self::StartUnconfirmed => [
                self::Confirmed,
                self::StartFailed,
            ],
            self::StartFailed => [self::Stopped],
            self::Refused, self::Confirmed, self::Cancelled => [],
        };
    }
}
