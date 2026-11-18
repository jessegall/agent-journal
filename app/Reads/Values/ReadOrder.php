<?php

declare(strict_types=1);

namespace App\Reads\Values;

/**
 * The columns a read is ordered by, ending in a unique key so two reads of the same rows agree.
 */
final readonly class ReadOrder
{
    /**
     * @param  list<array{column: string, direction: 'asc'|'desc'}>  $columns
     */
    private function __construct(public array $columns) {}

    /**
     * Newest first: created_at descending, then the key descending, both qualified by the table.
     */
    public static function newestFirst(string $table, string $key): self
    {
        return new self([['column' => "{$table}.created_at", 'direction' => 'desc'], ['column' => "{$table}.{$key}", 'direction' => 'desc']]);
    }

    /**
     * By the given columns, ascending, then the key; for a table without created_at, such as a pivot.
     *
     * @param  list<string>  $columns
     */
    public static function by(array $columns, string $key): self
    {
        return new self([...array_map(fn (string $column) => ['column' => $column, 'direction' => 'asc'], $columns), ['column' => $key, 'direction' => 'asc']]);
    }
}
