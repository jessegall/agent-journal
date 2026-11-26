<?php

declare(strict_types=1);

/**
 * Lists every distinct word the project's names use, most used first, as "count<TAB>word<TAB>example names", so a word
 * that should not be there can be found and added to docs/naming/forbidden-words.txt. Run it now and then, beside the
 * names check (name-faults.php).
 *
 *   php tools/refactoring/name-words.php                        every word of every name
 *   php tools/refactoring/name-words.php --type=method          only the words of one kind of name
 *   php tools/refactoring/name-words.php --since=<commit>       only the words no name of that commit's code used
 *   php tools/refactoring/name-words.php ... <paths>            only the names under the paths
 */

require_once __DIR__.'/project-names.php';

const EXAMPLE_COUNT = 3;

chdir(dirname(__DIR__, 2));
$options = getopt('', ['type:', 'since:'], $rest);
$paths = array_slice($argv, $rest) ?: PROJECT_FOLDERS;
$type = $options['type'] ?? null;
$names = array_filter(projectNames($paths), fn (DeclaredName $declared) => $type === null || $declared->declarationType === $type);
$known = isset($options['since']) ? wordsAt((string) $options['since'], $paths) : [];
$namesByWord = [];

foreach ($names as $declared) {
    foreach (array_unique(wordsOf($declared->name)) as $word) {
        if (! isset($known[$word])) {
            $namesByWord[$word][$declared->name] = true;
        }
    }
}

uasort($namesByWord, fn (array $first, array $second) => count($second) <=> count($first));

foreach ($namesByWord as $word => $wordNames) {
    echo count($wordNames)."\t{$word}\t".implode(', ', array_slice(array_keys($wordNames), 0, EXAMPLE_COUNT))."\n";
}

/**
 * Every word the identifiers of a commit's code held, from git's own copy of that commit.
 *
 * @param  list<string>  $paths
 * @return array<string, true>
 */
function wordsAt(string $commit, array $paths): array
{
    $identifiers = commandLines([
        'git',
        'grep',
        '-h',
        '-o',
        '-I',
        '-E',
        '[A-Za-z_][A-Za-z0-9_]{2,}',
        $commit,
        '--',
        ...$paths,
    ]);
    $words = [];

    foreach (array_unique($identifiers) as $identifier) {
        foreach (wordsOf($identifier) as $word) {
            $words[$word] = true;
        }
    }

    return $words;
}
