<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class SequenceIndexPageData extends LayoutPageData
{
    /** @use Buildable<SequenceIndexPageDataFields> */
    use Buildable;

    protected const string FIELDS = SequenceIndexPageDataFields::class;
}
