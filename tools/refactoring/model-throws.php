<?php

declare(strict_types=1);

/*
 * Lists every throw in an Eloquent model that sits outside a method named assert..., closures and arrow functions
 * inside a method included: a model refuses only from its assert methods.
 *
 *   php tools/refactoring/model-throws.php app domain
 */

use PhpParser\Node\Expr\Throw_;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/**
 * Whether a model method may throw: its name starts with assert.
 */
function mayThrow(ClassMethod $method): bool
{
    return str_starts_with($method->name->toString(), 'assert');
}

/**
 * The faults of one model as "line<TAB>fault".
 *
 * @return list<string>
 */
function throwFaultsOf(Class_ $model): array
{
    $faults = [];

    foreach ($model->getMethods() as $method) {
        if (mayThrow($method)) {
            continue;
        }

        foreach (new NodeFinder()->findInstanceOf($method->stmts ?? [], Throw_::class) as $throw) {
            $faults[] = "{$throw->getStartLine()}\tmethod {$method->name} throws; move the check into an assert method";
        }
    }

    return $faults;
}

/**
 * @param  list<string>  $arguments
 */
function runModelThrows(array $arguments): int
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $faultCount = 0;

    foreach (array_slice($arguments, 1) as $path) {
        foreach (phpFiles($path) as $file) {
            $source = (string) file_get_contents($file);
            $models = array_filter(
                new NodeFinder()->findInstanceOf(parsedOnce($parser, $file, $source), Class_::class),
                isModel(...),
            );

            foreach ($models as $model) {
                foreach (throwFaultsOf($model) as $fault) {
                    $faultCount++;
                    echo "{$file}:{$fault}\n";
                }
            }
        }
    }

    if ($faultCount === 0) {
        return 0;
    }

    return 1;
}

// Run as a command, not when another tool loads these functions.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    exit(runModelThrows($argv));
}
