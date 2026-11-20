<?php

declare(strict_types=1);

/*
 * Puts every run of attributes on a declaration in order of length, shortest on top (user message 9262), in the
 * given files and folders: php tools/refactoring/sort-attributes.php app domain tests. A run is two or more groups
 * each on its own line with only white space between them; groups of the same length keep their order.
 */

use PhpParser\Node\AttributeGroup;
use PhpParser\ParserFactory;
use Tests\Architecture\PhpStan\AttributeRuns;

require __DIR__.'/../../vendor/autoload.php';
require __DIR__.'/php-files.php';

/**
 * The source with each of its runs in order; the runs are rewritten from the end so earlier positions stay true.
 */
function sortedSource(string $source): string
{
    $tree = new ParserFactory()->createForHostVersion()->parse($source) ?? [];
    $runs = new AttributeRuns($source);
    $unordered = array_filter($runs->in($tree), fn (array $groups): bool => ! $runs->isOrdered($groups));
    usort($unordered, fn (array $first, array $second): int => $second[0]->getStartFilePos()
        <=> $first[0]->getStartFilePos());

    $sorted = $source;

    foreach ($unordered as $groups) {
        $start = $groups[0]->getStartFilePos();
        $end = $groups[array_key_last($groups)]->getEndFilePos();
        $lineStart = (int) strrpos(substr($source, 0, $start), "\n") + 1;
        $indent = substr($source, $lineStart, $start - $lineStart);
        $texts = array_map(fn (AttributeGroup $group): string => $runs->textOf($group), $runs->ordered($groups));
        $sorted = substr_replace($sorted, implode("\n".$indent, $texts), $start, $end - $start + 1);
    }

    return $sorted;
}

$changed = 0;

foreach (phpFiles(array_slice($argv, 1)) as $file) {
    $source = (string) file_get_contents($file);
    $sorted = sortedSource($source);

    if ($sorted !== $source) {
        file_put_contents($file, $sorted);
        $changed++;
        echo $file, PHP_EOL;
    }
}

echo sprintf('%d files reordered', $changed), PHP_EOL;
