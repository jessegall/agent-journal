<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;

/**
 * A list with its heading, filters, rows and the reader of a selected record.
 */
final class ListPage
{
    /** @use Buildable<ListPageFields> */
    use Buildable;

    protected const string FIELDS = ListPageFields::class;
}
