<?php

declare(strict_types=1);

namespace App\Support\Layout;

use App\Web\Creation\Exceptions\MissingFields;

final class LayoutTableDataFields
{
    /** @var list<LayoutRowData> */
    private array $rows;

    /**
     * @template TRecord
     * @param iterable<TRecord> $records
     * @param callable(TRecord): LayoutRowData $map
     */
    public function rows(iterable $records, callable $map): self
    {
        $rows = [];

        foreach ($records as $record) {
            $rows[] = $map($record);
        }

        $this->rows = $rows;

        return $this;
    }

    public function finish(): LayoutTableData
    {
        if (! isset($this->rows)) {
            throw MissingFields::forType(LayoutTableData::class, 'rows');
        }

        return new LayoutTableData(rows: $this->rows);
    }
}
