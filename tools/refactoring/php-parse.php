<?php

declare(strict_types=1);

/**
 * The one funnel every PHP parse of the refactoring tools goes through: a file is read once per run, from the tree
 * ParsedTrees keeps for the tests too, and a second read of it stops the run.
 */

use PhpParser\Node;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\NameResolver;
use Tests\Architecture\Support\ParsedTrees;

/**
 * @return list<Node>
 */
function parsedOnce(string $file, string $code): array
{
    static $parsed = [];

    if (isset($parsed[$file])) {
        throw new LogicException("{$file} would be parsed a second time; a run works on its one parse of each file.");
    }

    $parsed[$file] = true;
    // Each declaration learns its full name, and no name in the tree is changed.
    $traverser = new NodeTraverser(new NameResolver(null, ['replaceNodes' => false]));

    return $traverser->traverse(ParsedTrees::raw($file, $code));
}
