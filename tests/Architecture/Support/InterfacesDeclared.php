<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Interface_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The interfaces a file declares, by full name.
 *
 * @implements FileScan<string>
 */
final readonly class InterfacesDeclared implements FileScan
{
    public function key(): string
    {
        return 'interfaces-declared-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return array_values(array_filter(array_map(
            fn (Interface_ $interface) => $interface->namespacedName?->toString() ?? '',
            new NodeFinder()->findInstanceOf($file->statements, Interface_::class),
        ), fn (string $name) => $name !== ''));
    }
}
