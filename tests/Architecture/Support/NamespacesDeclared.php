<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Stmt\Namespace_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The namespaces a file declares, each with its line; the global namespace has an empty name.
 *
 * @implements FileScan<array{name: string, line: int}>
 */
final readonly class NamespacesDeclared implements FileScan
{
    public function key(): string
    {
        return 'namespaces-declared-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return array_values(array_map(
            fn (Namespace_ $namespace) => ['name' => $namespace->name?->toString() ?? '', 'line' => $namespace->getStartLine()],
            (new NodeFinder)->findInstanceOf($file->statements, Namespace_::class),
        ));
    }
}
