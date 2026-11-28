<?php

declare(strict_types=1);

namespace Domain\Reminders\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RemindersPageData extends LayoutPageData
{
    /** @use Buildable<RemindersPageDataFields> */
    use Buildable;

    protected const string FIELDS = RemindersPageDataFields::class;
}
