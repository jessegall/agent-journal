<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr\New_;
use PhpParser\Node\Name;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Where a file makes a PHP parser of its own, as "<path>:<line>", so a tree is made only by ParsedTrees.
 *
 * @implements FileScan<string>
 */
final readonly class ParserMakingScan implements FileScan
{
    public function key(): string
    {
        return 'parser-making-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $makings = new NodeFinder()->find(
            $file->statements,
            fn ($node) => $node instanceof New_ && $node->class instanceof Name
                && $node->class->toString() === 'PhpParser\\ParserFactory',
        );

        return array_values(array_map(fn (Node $making) => "{$file->path}:{$making->getStartLine()}", $makings));
    }
}
