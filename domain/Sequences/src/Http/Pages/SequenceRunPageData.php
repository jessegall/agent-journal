<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class SequenceRunPageData extends LayoutPageData
{
    /** @use Buildable<SequenceRunPageDataFields> */
    use Buildable;

    protected const string FIELDS = SequenceRunPageDataFields::class;
}
