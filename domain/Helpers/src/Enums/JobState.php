<?php

declare(strict_types=1);

namespace Domain\Helpers\Enums;

/**
 * Where one helper job stands.
 */
enum JobState: string
{
    case Accepted = 'accepted';
    case Running = 'running';
    case Unfinished = 'unfinished';
    case Held = 'held';
    case Finished = 'finished';
    case Cancelled = 'cancelled';
    case Failed = 'failed';

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
