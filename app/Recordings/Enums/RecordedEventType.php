<?php

declare(strict_types=1);

namespace App\Recordings\Enums;

/**
 * What happened in a recorded exchange: something went in, something came out, or its terminal was resized.
 */
enum RecordedEventType: string
{
    case Typed = 'typed';
    case Printed = 'printed';
    case Resized = 'resized';
}
