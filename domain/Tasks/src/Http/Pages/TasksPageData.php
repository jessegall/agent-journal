<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class TasksPageData extends LayoutPageData
{
    /** @use Buildable<TasksPageDataFields> */
    use Buildable;

    protected const string FIELDS = TasksPageDataFields::class;
}
