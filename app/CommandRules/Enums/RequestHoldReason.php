<?php

declare(strict_types=1);

namespace App\CommandRules\Enums;

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

    /**
     * Whether the request holds a command already known as a test, check or build, which waits for its reader.
     */
    public function needsReader(): bool
    {
        return $this === self::ReaderRequired || $this === self::ReaderStale;
    }
}
