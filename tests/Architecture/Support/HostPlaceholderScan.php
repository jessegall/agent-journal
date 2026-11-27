<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Every {host:NAME} a string literal of the code writes into a plan, with its line.
 *
 * @implements FileScan<array{line: int, name: string}>
 */
final readonly class HostPlaceholderScan implements FileScan
{
    public function key(): string
    {
        return 'host-placeholders-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, String_::class) as $literal) {
            preg_match_all('/\{host:([A-Z][A-Z0-9_]*)\}/', $literal->value, $matches);

            foreach ($matches[1] as $name) {
                $findings[] = ['line' => $literal->getStartLine(), 'name' => $name];
            }
        }

        return $findings;
    }
}
