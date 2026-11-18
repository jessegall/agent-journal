<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\FileScan;

/**
 * Every name a file's code refers to, as NameScan reads it.
 *
 * @implements FileScan<NameUse>
 */
final readonly class NamesUsed implements FileScan
{
    public function key(): string
    {
        return 'names-used-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return NameScan::of($file);
    }
}
