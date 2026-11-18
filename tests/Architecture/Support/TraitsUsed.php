<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Name;
use PhpParser\Node\Stmt\TraitUse;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The traits a file's types use, by full name.
 *
 * @implements FileScan<string>
 */
final readonly class TraitsUsed implements FileScan
{
    public function key(): string
    {
        return 'traits-used-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $traits = [];

        foreach ((new NodeFinder)->findInstanceOf($file->statements, TraitUse::class) as $traitUse) {
            array_push($traits, ...array_map(fn (Name $trait) => $trait->toString(), $traitUse->traits));
        }

        return $traits;
    }
}
