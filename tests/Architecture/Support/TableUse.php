<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * One use of a table by name in a file; for a name that is not written out, the table holds the code in its place.
 */
final readonly class TableUse
{
    public function __construct(
        public string $file,
        public int $line,
        public string $table,
        public TableType $type,
    ) {}
}
