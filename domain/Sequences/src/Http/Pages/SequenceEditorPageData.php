<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class SequenceEditorPageData extends LayoutPageData
{
    /** @use Buildable<SequenceEditorPageDataFields> */
    use Buildable;

    protected const string FIELDS = SequenceEditorPageDataFields::class;
}
