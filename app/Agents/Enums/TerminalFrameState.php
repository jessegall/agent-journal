<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What a viewer's terminal shows: the live screen, nothing newer than the screen it holds, the screen of a host that
 * proves no liveness as last reported, no preview of a screen its host shielded, a contained attachment lost while
 * its container runs, the last screen of a terminal that ended, or a restart of the same session, which asks for a
 * fresh open.
 */
enum TerminalFrameState: string
{
    case Live = 'live';
    case Unchanged = 'unchanged';
    case LastReported = 'last_reported';
    case PreviewUnavailable = 'preview_unavailable';
    case ConnectionLost = 'connection_lost';
    case Ended = 'ended';
    case Restarted = 'restarted';
}
