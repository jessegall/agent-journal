<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Why a command waits on a request instead of running: no rule knows it, it needs a proven reader, its reader no
 * longer matches, or what it binds to changed.
 */
enum RequestHoldReason: string
{
    case UnknownCommand = 'unknown_command';
    case ReaderRequired = 'reader_required';
    case ReaderStale = 'reader_stale';
    case BindingChanged = 'binding_changed';
}
