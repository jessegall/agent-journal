<?php

declare(strict_types=1);

namespace App\Domain\Web\Enums;

/**
 * How a window, section or inspector prop came out: read, failed, or refused by a visibility check.
 */
enum WindowState: string
{
    case Ready = 'ready';
    case Failed = 'failed';
    case Denied = 'denied';
}
