<?php

declare(strict_types=1);

namespace App\Enums\Web;

/**
 * How a window, section or inspector prop came out: read, failed, refused by a visibility check, or naming a record
 * the user cannot read, told apart from one that does not exist by nothing.
 */
enum WindowState: string
{
    case Ready = 'ready';
    case Failed = 'failed';
    case Denied = 'denied';
    case Unavailable = 'unavailable';
}
