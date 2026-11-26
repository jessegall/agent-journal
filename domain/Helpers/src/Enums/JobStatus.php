<?php

declare(strict_types=1);

namespace Domain\Helpers\Enums;

/**
 * Where one helper job stands.
 */
enum JobStatus: string
{
    case Accepted = 'accepted';
    case Running = 'running';
    case Unfinished = 'unfinished';
    case Held = 'held';
    case Finished = 'finished';
    case Cancelled = 'cancelled';
    case Failed = 'failed';

    /**
     * The state as a list shows it.
     */
    public function label(): string
    {
        return match ($this) {
            self::Accepted => 'Accepted',
            self::Running => 'Running',
            self::Unfinished => 'Unfinished',
            self::Held => 'Held',
            self::Finished => 'Finished',
            self::Cancelled => 'Cancelled',
            self::Failed => 'Failed',
        };
    }

    public function isFinal(): bool
    {
        return in_array($this, [self::Finished, self::Cancelled, self::Failed], true);
    }

    /**
     * Whether a helper is working the job now, so steering reaches it.
     */
    public function isLive(): bool
    {
        return in_array($this, [self::Accepted, self::Running], true);
    }
}
