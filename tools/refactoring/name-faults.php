<?php

declare(strict_types=1);

/**
 * The names check: reads every name of the project fresh from the code and prints each that breaks a naming rule
 * (name-grammar.php, docs/naming/forbidden-words.txt). Nothing is written down; a bad pattern is added to the
 * forbidden words, or to the grammar when it is a shape. Run it at every phase end, plan end, or whenever asked.
 *
 *   php tools/refactoring/name-faults.php            every name of the project; writes the words it learned
 *   php tools/refactoring/name-faults.php <paths>    only the names under the paths
 *   php tools/refactoring/name-faults.php --staged   only the names in the files staged for a commit (the pre-commit hook)
 *   php tools/refactoring/name-faults.php --vocabulary   only learns the words of the whole code and writes them
 *       A scan of part of the code judges with the words the last whole scan learned (storage/names/vocabulary.json),
 *       and makes that whole scan first when there is none.
 *   php tools/refactoring/name-faults.php rename report notify --type=class --namespace=App\\Pipes [--path=app] [--apply]
 *       lists every name holding the word with its new name, and with --apply renames each from the syntax tree of
 *       its language, PHP, Go, TypeScript and Vue, each loaded once (name-renames.php). Shell names are renamed by hand.
 */

require_once __DIR__.'/project-names.php';
require_once __DIR__.'/name-renames.php';

$root = dirname(__DIR__, 2);
chdir($root);

if (($argv[1] ?? '') === 'rename') {
    exit(renameNames(array_slice($argv, 2)));
}

const VOCABULARY_FILE = 'storage/names/vocabulary.json';

$arguments = array_slice($argv, 1);

if ($arguments === ['--vocabulary']) {
    NameVocabulary::of(projectNames(PROJECT_FOLDERS))->writeTo(VOCABULARY_FILE);

    exit(0);
}

$isStaged = $arguments === ['--staged'];
$paths = $isStaged ? stagedFiles() : $arguments;

if ($isStaged && $paths === []) {
    exit(0);
}

$names = projectNames($paths === [] ? PROJECT_FOLDERS : $paths);
$vocabulary = $paths === [] ? NameVocabulary::of($names) : wholeCodeVocabulary();

if ($paths === []) {
    $vocabulary->writeTo(VOCABULARY_FILE);
}

$faults = nameFaults($names, $vocabulary, "{$root}/docs/naming/forbidden-words.txt");

if ($faults === []) {
    echo "Every name follows the naming rules.\n";

    exit(0);
}

echo count($faults)." names break the naming rules; rename each at its source:\n";

foreach ($faults as $fault) {
    echo "  {$fault}\n";
}

exit(1);

/**
 * The files staged for the commit being made, added, copied, modified or renamed, under the project's folders; the
 * files that hold no name of the project's own (the fixture of faults kept on purpose) are left out.
 *
 * @return list<string>
 */
function stagedFiles(): array
{
    $staged = commandLines([
        'git',
        'diff',
        '--cached',
        '--name-only',
        '--diff-filter=ACMR',
        '--',
        ...PROJECT_FOLDERS,
    ]);

    return array_values(array_filter($staged, fn (string $file) => is_file($file) && preg_match(NOT_PROJECT_NAMES, $file) !== 1));
}

/**
 * The words the last whole scan learned, or those of a whole scan made now when none was written.
 */
function wholeCodeVocabulary(): NameVocabulary
{
    // learned in a process of its own: this one parses the scanned files, and a file is parsed once per process
    if (! is_file(VOCABULARY_FILE)) {
        commandLines([
            PHP_BINARY,
            __FILE__,
            '--vocabulary',
        ]);
    }

    return NameVocabulary::fromFile(VOCABULARY_FILE);
}
