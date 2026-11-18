<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The classes a file declares, by full name; what they extend is asked of the running code afterwards, so a parent
 * changed in another file never leaves a stale finding.
 *
 * @implements FileScan<string>
 */
final readonly class ClassesDeclared implements FileScan
{
    public function key(): string
    {
        return 'classes-declared-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return array_values(array_filter(array_map(
            fn (Class_ $class) => $class->namespacedName?->toString() ?? '',
            new NodeFinder()->findInstanceOf($file->statements, Class_::class),
        ), fn (string $name) => $name !== ''));
    }
}
