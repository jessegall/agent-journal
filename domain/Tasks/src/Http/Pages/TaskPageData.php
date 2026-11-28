<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class TaskPageData extends LayoutPageData
{
    /** @use Buildable<TaskPageDataFields> */
    use Buildable;

    protected const string FIELDS = TaskPageDataFields::class;
}
