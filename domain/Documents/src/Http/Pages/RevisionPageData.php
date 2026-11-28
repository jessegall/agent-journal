<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RevisionPageData extends LayoutPageData
{
    /** @use Buildable<RevisionPageDataFields> */
    use Buildable;

    protected const string FIELDS = RevisionPageDataFields::class;
}
