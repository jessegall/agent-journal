<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class NewSequencePageData extends LayoutPageData
{
    /** @use Buildable<NewSequencePageDataFields> */
    use Buildable;

    protected const string FIELDS = NewSequencePageDataFields::class;
}
