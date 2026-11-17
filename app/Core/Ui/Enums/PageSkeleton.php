<?php

declare(strict_types=1);

namespace App\Core\Ui\Enums;

/**
 * The shape a page shows while its data loads.
 */
enum PageSkeleton: string
{
    case Rows = 'rows';
    case Cards = 'cards';
    case Reader = 'reader';
}
