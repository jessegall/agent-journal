<?php

declare(strict_types=1);

namespace App\Support\Recordings\Enums;

/**
 * What happened in a recorded exchange: something went in, something came out, or its terminal was resized.
 */
enum RecordedEventType: string
{
    case Typed = 'typed';
    case Printed = 'printed';
    case Resized = 'resized';
    case Asked = 'asked';
    case Answered = 'answered';
}
