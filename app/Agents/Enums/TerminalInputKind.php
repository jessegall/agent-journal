<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * What one browser input carries: ordinary text with or without Enter, one named key, a paste, or the size the
 * controlling view gives the terminal.
 */
enum TerminalInputKind: string
{
    case Text = 'text';
    case Key = 'key';
    case Paste = 'paste';
    case Resize = 'resize';
    case Private = 'private';
}
