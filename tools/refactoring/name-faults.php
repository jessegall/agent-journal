<?php

declare(strict_types=1);

/**
 * The names check: reads every name of the project fresh from the code and prints each that breaks a naming rule
 * (name-grammar.php, docs/naming/forbidden-words.txt). Nothing is written down; a bad pattern is added to the
 * forbidden words, or to the grammar when it is a shape. Run it at every phase end, plan end, or whenever asked.
 *
 *   php tools/refactoring/name-faults.php            every name of the project
 *   php tools/refactoring/name-faults.php <paths>    only the names under the paths
 *   php tools/refactoring/name-faults.php rename report notify --type=class --namespace=App\\Pipes [--path=app] [--apply]
 *       lists every PHP name holding the word with its new name, and with --apply renames each from the syntax tree
 *       (name-renames.php). Frontend, Go and shell names are renamed by hand.
 */

require_once __DIR__.'/project-names.php';
require_once __DIR__.'/name-renames.php';

$root = dirname(__DIR__, 2);
chdir($root);

if (($argv[1] ?? '') === 'rename') {
    exit(renameNames(array_slice($argv, 2)));
}

$paths = array_slice($argv, 1) ?: PROJECT_FOLDERS;
$faults = nameFaults(projectNames($paths), "{$root}/docs/naming/forbidden-words.txt");

if ($faults === []) {
    echo "Every name follows the naming rules.\n";

    exit(0);
}

echo count($faults)." names break the naming rules; rename each at its source:\n";

foreach ($faults as $fault) {
    echo "  {$fault}\n";
}

exit(1);
