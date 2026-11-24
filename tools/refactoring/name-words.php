<?php

declare(strict_types=1);

/**
 * Counts the words of the reviewed names of one declaration type, most used first, so a word that recurs without
 * naming anything can be found and added to forbidden-words.txt.
 *
 *   php tools/refactoring/name-words.php docs/naming/reviewed-names.txt method
 *       prints "count<TAB>word<TAB>three names that hold it" for every word of the method names.
 */

require_once __DIR__.'/name-word-splitting.php';

[, $reviewedFile, $declarationType] = $argv + [null, 'docs/naming/reviewed-names.txt', 'method'];
$namesByWord = [];

foreach (file($reviewedFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
    [$type, $name] = explode("\t", $line) + [1 => ''];

    if ($type !== $declarationType) {
        continue;
    }

    foreach (array_unique(wordsOf($name)) as $word) {
        $namesByWord[$word][] = $name;
    }
}

uasort($namesByWord, fn (array $first, array $second) => count($second) <=> count($first));

foreach ($namesByWord as $word => $names) {
    echo count($names)."\t{$word}\t".implode(', ', array_slice($names, 0, 3))."\n";
}
