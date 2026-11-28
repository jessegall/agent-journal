<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages;

use App\Web\Creation\LayoutPageData;

final class ShelfLayoutPageData extends LayoutPageData
{
    /** @use \App\Web\Creation\Buildable<ShelfLayoutPageDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = ShelfLayoutPageDataFields::class;
}
