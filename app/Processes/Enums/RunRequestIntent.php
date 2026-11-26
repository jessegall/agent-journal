<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Why a run was admitted: someone asked for it, a scheduled check ran it, or someone asked again for a lost run.
 */
enum RunRequestIntent: string
{
    case ExplicitRequest = 'explicit_request';
    case ScheduledCheck = 'scheduled_check';
    case Retry = 'retry';

    /**
     * Whether someone asked for the run, so its outcome is sent to them.
     */
    public function isRequested(): bool
    {
        return $this !== self::ScheduledCheck;
    }
}
