<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * How far a part's output was kept: still recording, complete, incomplete, found corrupt, or removed by retention.
 */
enum CaptureState: string
{
    case Recording = 'recording';
    case Complete = 'complete';
    case Incomplete = 'incomplete';
    case Corrupt = 'corrupt';
    case Removed = 'removed';
}
