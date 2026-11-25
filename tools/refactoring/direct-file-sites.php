<?php

declare(strict_types=1);

/**
 * Lists the direct file access sites outside the Files area, as docs/naming/direct-file-access-sites.txt keeps them.
 *
 *   php tools/refactoring/direct-file-sites.php           prints the list the code holds now
 *   php tools/refactoring/direct-file-sites.php --write   writes it to docs/naming/direct-file-access-sites.txt
 */

use Tests\Architecture\Support\DirectFileAccess;

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';

$text = DirectFileAccess::across($root)->outsideTheFilesArea()->listText();

if (in_array('--write', array_slice($argv, 1), true)) {
    file_put_contents($root.'/'.DirectFileAccess::WAITING_LIST, $text);

    return;
}

echo $text;
