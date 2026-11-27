<?php

declare(strict_types=1);

/**
 * Checks that every Eloquent model makes its new rows through one static create (or createFor...): it prints
 * "file:line<TAB>Model::method" for a public static that saves one new row under another name. A find-or-create, a
 * method writing several rows or changing a locked one is no constructor and keeps its name.
 *
 *   php tools/refactoring/model-constructors.php app domain
 */

use PhpParser\Node\Stmt\Class_;
use PhpParser\NodeFinder;

require dirname(__DIR__, 2).'/vendor/autoload.php';
require __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

$finder = new NodeFinder();
$faults = 0;

foreach (array_slice($argv, 1) as $path) {
    foreach (phpFiles($path) as $file) {
        $code = (string) file_get_contents($file);

        foreach ($finder->findInstanceOf(parsedOnce($file, $code), Class_::class) as $class) {
            if (! isModel($class)) {
                continue;
            }

            foreach ($class->getMethods() as $method) {
                $body = substr(
                    $code,
                    $method->getStartFilePos(),
                    $method->getEndFilePos() - $method->getStartFilePos() + 1,
                );
                $makesRow = preg_match(ROW_SAVES_NEW, $body) === 1 && preg_match(ROW_NOT_ONE_NEW, $body) === 0;

                $isNamedCreate = str_starts_with($method->name->toString(), 'create');

                if (! $method->isStatic() || ! $method->isPublic() || ! $makesRow || $isNamedCreate) {
                    continue;
                }

                echo "{$file}:{$method->getStartLine()}\t{$class->name}::{$method->name}\n";
                $faults++;
            }
        }
    }
}

exit($faults > 0 ? 1 : 0);
