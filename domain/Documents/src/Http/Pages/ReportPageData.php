<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Web\Attributes\RecordScoped;
use App\Web\Creation\Buildable;
use App\Web\Creation\RecordPageData;

#[RecordScoped('report')]
final class ReportPageData extends RecordPageData
{
    /** @use Buildable<ReportPageDataFields> */
    use Buildable;

    protected const string FIELDS = ReportPageDataFields::class;
}
