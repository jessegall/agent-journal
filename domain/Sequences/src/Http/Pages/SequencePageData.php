<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class SequencePageData extends LayoutPageData
{
    /** @use Buildable<SequencePageDataFields> */
    use Buildable;

    protected const string FIELDS = SequencePageDataFields::class;
}
