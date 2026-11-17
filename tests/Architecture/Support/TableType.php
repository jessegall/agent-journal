<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * How code uses a table, as fine as the table rules decide on.
 */
enum TableType: string
{
    case Create = 'create';
    case Read = 'read';
    case ForeignKey = 'foreign-key';
    case Pivot = 'pivot';
    case ModelTable = 'model-table';
    case Change = 'change';
    case NotWritten = 'not-written';
    case PivotNotWritten = 'pivot-not-written';
}
