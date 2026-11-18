<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What a supervisor reports over its event channel.
 */
enum RunEventType: string
{
    case PartQueued = 'part_queued';
    case PartStarted = 'part_started';
    case PartStartedInside = 'part_started_inside';
    case PartEnded = 'part_ended';
    case PartSkipped = 'part_skipped';
    case PartStartFailed = 'part_start_failed';
    case PartStopped = 'part_stopped';
    case PartLost = 'part_lost';
    case RunStopped = 'run_stopped';
    case Heartbeat = 'heartbeat';
}
