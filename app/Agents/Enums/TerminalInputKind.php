<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What one browser input carries: ordinary text with or without Enter, one named key, or a paste.
 */
enum TerminalInputKind: string
{
    case Text = 'text';
    case Key = 'key';
    case Paste = 'paste';
}
