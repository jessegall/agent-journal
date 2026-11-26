<?php

declare(strict_types=1);

namespace App\Terminals\Enums;

/**
 * What one browser input carries: ordinary text with or without Enter, one named key, a paste, or the size the
 * controlling view gives the terminal.
 */
enum TerminalInputType: string
{
    case Text = 'text';
    case Key = 'key';
    case Paste = 'paste';
    case Resize = 'resize';
    case Private = 'private';
}
