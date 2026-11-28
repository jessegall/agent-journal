<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Http\Pages;

use App\Web\Creation\LayoutPageData;

final class EntryPageData extends LayoutPageData
{
    /** @use \App\Web\Creation\Buildable<EntryPageDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = EntryPageDataFields::class;
}
