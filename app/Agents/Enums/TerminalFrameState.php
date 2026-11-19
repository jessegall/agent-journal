<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What a viewer's terminal shows: the live screen, the last screen of a terminal that ended, or the first answer
 * after the view followed the agent to its restarted runtime.
 */
enum TerminalFrameState: string
{
    case Live = 'live';
    case Ended = 'ended';
    case Restarted = 'restarted';
}
