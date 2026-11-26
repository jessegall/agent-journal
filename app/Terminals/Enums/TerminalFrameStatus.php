<?php

declare(strict_types=1);

namespace App\Terminals\Enums;

/**
 * What a viewer's terminal shows: the live screen, nothing newer, a screen as last reported, no preview of a shielded
 * screen, a lost contained attachment, the last screen of an ended terminal, or a restart that asks for a fresh open.
 */
enum TerminalFrameStatus: string
{
    case Live = 'live';
    case Unchanged = 'unchanged';
    case LastReported = 'last_reported';
    case PreviewUnavailable = 'preview_unavailable';
    case ConnectionLost = 'connection_lost';
    case Ended = 'ended';
    case Restarted = 'restarted';
}
