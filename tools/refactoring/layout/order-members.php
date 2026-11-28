<?php

declare(strict_types=1);

/*
 * Lays out the members of the one class in each named file, unless it is laid out in sections: trait uses, constants,
 * properties, the constructor, public, protected, then private methods, each keeping its comments and its order.
 *
 *   php tools/refactoring/layout/order-members.php <file.php> [<file.php> ...]
 */

use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;

require dirname(__DIR__, 3).'/vendor/autoload.php';
require_once dirname(__DIR__).'/php-parse.php';
require_once __DIR__.'/class-members.php';

foreach (array_slice($argv, 1) as $file) {
    $source = (string) file_get_contents($file);
    $class = new NodeFinder()->findFirstInstanceOf(parsedOnce($file, $source), Class_::class);

    if ($class === null || $class->stmts === [] || str_contains($source, '// ----------[')) {
        echo "{$file}: left as it is\n";

        continue;
    }

    $ranked = array_keys($class->stmts);
    usort($ranked, fn (int $left, int $right) => [
        memberRank($class->stmts[$left]),
        $left,
    ] <=> [
        memberRank($class->stmts[$right]),
        $right,
    ]);
    $body = implode("\n\n", array_map(fn (int $index) => memberText($source, $class->stmts[$index]), $ranked));
    $open = (int) strpos($source, '{', ($class->name ?? $class)->getEndFilePos()) + 1;
    file_put_contents($file, substr($source, 0, $open)."\n{$body}\n".substr($source, $class->getEndFilePos()));
    echo "{$file}: laid out\n";
}
