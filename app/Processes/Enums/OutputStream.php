<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * The stream an output chunk was read from; Merged when a part's standard output and error share one pipe.
 */
enum OutputStream: string
{
    case Stdout = 'stdout';
    case Stderr = 'stderr';
    case Merged = 'merged';

    /**
     * The stream a docked console part names.
     */
    public function consoleStream(): ConsoleStream
    {
        return match ($this) {
            self::Stdout => ConsoleStream::Stdout,
            self::Stderr => ConsoleStream::Stderr,
            self::Merged => ConsoleStream::Combined,
        };
    }
}
