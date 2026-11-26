<?php

declare(strict_types=1);

namespace App\Terminals\Enums;

/**
 * Which way a split of the pane grid lays its two nodes: side by side in a row, or one above the other in a column.
 */
enum SplitAxis: string
{
    case Row = 'row';
    case Column = 'column';
}
