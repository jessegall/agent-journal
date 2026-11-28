<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class LibraryPageData extends LayoutPageData
{
    /** @use Buildable<LibraryPageDataFields> */
    use Buildable;

    protected const string FIELDS = LibraryPageDataFields::class;
}
