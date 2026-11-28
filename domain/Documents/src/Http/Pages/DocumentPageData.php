<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Web\Attributes\RecordScoped;
use App\Web\Creation\Buildable;
use App\Web\Creation\RecordPageData;

#[RecordScoped('document')]
final class DocumentPageData extends RecordPageData
{
    /** @use Buildable<DocumentPageDataFields> */
    use Buildable;

    protected const string FIELDS = DocumentPageDataFields::class;
}
