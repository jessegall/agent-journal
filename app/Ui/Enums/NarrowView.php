<?php

declare(strict_types=1);

namespace App\Ui\Enums;

/**
 * What a split shows in a narrow container: the list and the reader stacked, the list alone for an index address, or
 * the reader alone, with Back to the list, for a record address.
 */
enum NarrowView: string
{
    case Both = 'both';
    case List = 'list';
    case Reader = 'reader';
}
