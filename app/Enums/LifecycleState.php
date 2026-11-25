<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a run or one of its parts is in its life: queued, running, draining its
 * streams after the process ended, or one of the ends.
 */
enum LifecycleState: string
{
    case Queued = 'queued';
    case Running = 'running';
    case Draining = 'draining';
    case Ended = 'ended';
    case Stopped = 'stopped';
    case Lost = 'lost';
    case SpawnFailed = 'spawn_failed';
    case Skipped = 'skipped';

    /**
     * Whether a part in this state may move to the next one.
     */
    public function canMoveTo(self $next): bool
    {
        return in_array($next, match ($this) {
            self::Queued => [
                self::Running,
                self::SpawnFailed,
                self::Skipped,
                self::Stopped,
            ],
            self::Running => [
                self::Draining,
                self::Stopped,
                self::Lost,
            ],
            self::Draining => [
                self::Ended,
                self::Lost,
            ],
            self::Ended, self::Stopped, self::Lost, self::SpawnFailed, self::Skipped => [],
        }, true);
    }

    public function isFinal(): bool
    {
        return in_array($this, [
            self::Ended,
            self::Stopped,
            self::Lost,
            self::SpawnFailed,
            self::Skipped,
        ], true);
    }
}
