<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class SequenceRunsPageData extends LayoutPageData
{
    /** @use Buildable<SequenceRunsPageDataFields> */
    use Buildable;

    protected const string FIELDS = SequenceRunsPageDataFields::class;
}
