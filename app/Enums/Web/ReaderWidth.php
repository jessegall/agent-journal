<?php

declare(strict_types=1);

namespace App\Enums\Web;

/**
 * The named widths of a split's reader: the standard 760 px, Settings' 720 px, or none for a reader that fills its
 * column, such as Plans.
 */
enum ReaderWidth: string
{
    case Standard = 'standard';
    case Settings = 'settings';
    case Unrestricted = 'unrestricted';
}
