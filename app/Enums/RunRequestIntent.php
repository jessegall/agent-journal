<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Why a run was admitted: someone asked for it, a scheduled check ran it, or someone asked again for a lost run.
 */
enum RunRequestIntent: string
{
    case ExplicitRequest = 'explicit_request';
    case ScheduledCheck = 'scheduled_check';
    case Retry = 'retry';

    /**
     * Whether someone asked for the run, so its outcome is theirs to hear about.
     */
    public function isRequested(): bool
    {
        return $this !== self::ScheduledCheck;
    }
}
