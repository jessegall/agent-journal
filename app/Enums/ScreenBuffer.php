<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Which screen buffer a terminal shows: the normal one, or the alternate one full-screen drivers draw on.
 */
enum ScreenBuffer: string
{
    case Normal = 'normal';
    case Alternate = 'alternate';
}
