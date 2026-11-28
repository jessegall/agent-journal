<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Buildable;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

final class LayoutTableData extends Data
{
    /** @use Buildable<LayoutTableDataFields> */
    use Buildable;

    protected const string FIELDS = LayoutTableDataFields::class;

    /** @param list<LayoutRowData> $rows */
    public function __construct(
        #[DataCollectionOf(LayoutRowData::class)]
        public readonly array $rows,
    ) {}

    /** @return list<LayoutPartData> */
    public function parts(): array
    {
        $parts = [];

        foreach (array_chunk($this->rows, LayoutPartData::ROW_LIMIT) as $index => $rows) {
            $key = $index === 0 ? 'rows' : "rows-{$index}";
            $parts[] = LayoutPartData::build()->asCollection()->key($key)->style('list')->rows($rows)->finish();
        }

        return $parts;
    }
}
