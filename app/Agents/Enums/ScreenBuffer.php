<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Which screen buffer a terminal shows: the normal one, or the alternate one full-screen programs draw on.
 */
enum ScreenBuffer: string
{
    case Normal = 'normal';
    case Alternate = 'alternate';
}
