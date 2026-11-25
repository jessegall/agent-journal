<?php

declare(strict_types=1);

namespace App\Enums\Runs;

/**
 * The stream a console preview was read from.
 */
enum ConsoleStream: string
{
    case Stdout = 'stdout';
    case Stderr = 'stderr';
    case Combined = 'combined';
}
