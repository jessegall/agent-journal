<?php

declare(strict_types=1);

namespace Domain\Chat\Enums;

use App\Processes\Enums\OutputStream;

/**
 * The stream a console preview was read from.
 */
enum ConsoleStream: string
{
    case Stdout = 'stdout';
    case Stderr = 'stderr';
    case Combined = 'combined';

    /**
     * The console stream that shows a run's output stream.
     */
    public static function of(OutputStream $stream): self
    {
        return match ($stream) {
            OutputStream::Stdout => self::Stdout,
            OutputStream::Stderr => self::Stderr,
            OutputStream::Merged => self::Combined,
        };
    }
}
