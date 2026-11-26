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
}
