<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use App\Data\PaginationData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The tasks window's page: its rows, the filters it was read with and where it is among the pages.
 */
#[TypeScript]
final class TaskListData extends Data
{
    /**
     * @param  list<TaskRowData>  $rows
     */
    public function __construct(
        #[DataCollectionOf(TaskRowData::class)]
        public readonly array $rows,
        public readonly TaskFiltersData $filters,
        public readonly PaginationData $pagination,
    ) {}
}
