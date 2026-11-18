<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\FileScan;

/**
 * Every name a file refers to in its code, its docblocks and its strings; strings are read against the project's
 * namespaces, so those are part of the key.
 *
 * @implements FileScan<NameUse>
 */
final readonly class NamesUsedAnywhere implements FileScan
{
    public function __construct(private ProjectRoots $roots) {}

    public function key(): string
    {
        return 'names-used-anywhere-1-'.sha1(serialize($this->roots->namespaces));
    }

    public function findingsIn(ParsedFile $file): array
    {
        return [...NameScan::of($file), ...DocblockScan::of($file), ...StringScan::of($file, $this->roots)];
    }
}
