<?php

declare(strict_types=1);

/**
 * Lists the writes of a row through an array, such as create([...]), update([...]) or updateOrCreate: a model assigns
 * each column as a property and saves, so the property types check every column. A mass update of scoped rows stays.
 *
 *   php tools/refactoring/array-writes.php app domain
 *       prints "file:line<TAB>..." for each such write, and fails while there is one.
 */

use PhpParser\Node;
use PhpParser\Node\Expr\Array_;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\New_;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\NodeFinder;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/** The calls that take a row's columns as an array. */
const ARRAY_WRITES = [
    'create',
    'forceCreate',
    'update',
    'fill',
    'forceFill',
];

/** The reads that write a row from an array when they find none. */
const ARRAY_FINDS = [
    'firstOrCreate',
    'firstOrNew',
    'createOrFirst',
    'updateOrCreate',
];

main(array_slice($argv, 1));

/**
 * @param  list<string>  $paths
 */
function main(array $paths): void
{
    $faults = [];

    foreach ($paths as $path) {
        foreach (phpFiles($path) as $file) {
            if (preg_match('#(^|/)domain/[^/]+/tests/#', $file) === 1) {
                continue;
            }

            $code = file_get_contents($file);

            // Only a model writes rows; a value class may well be built from an array.
            if (preg_match('/^(?:final )?(?:abstract )?class \w+ extends (?:Model|Pivot|MorphPivot|Authenticatable)\b/m', $code) !== 1) {
                continue;
            }

            $nodes = parsedOnce($file, $code);

            foreach (new NodeFinder()->find($nodes, fn (Node $node) => isArrayWrite($node)) as $write) {
                $faults[] = "{$file}:{$write->getStartLine()}\tthe row is written through an array: assign each column "
                    .'as a property and save';
            }
        }
    }

    echo implode('', array_map(fn (string $fault) => $fault."\n", $faults));
    exit($faults === [] ? 0 : 1);
}

/**
 * Whether a node writes one row's columns from an array: new self([...]), Model::query()->create([...]), or
 * update, fill or forceFill of an array on a model held in a variable.
 */
function isArrayWrite(Node $node): bool
{
    if ($node instanceof New_) {
        return $node->class instanceof Node\Name && in_array($node->class->toString(), ['self', 'static'], true)
            && isset($node->args[0]) && $node->args[0]->value instanceof Array_;
    }

    if ($node instanceof MethodCall && $node->name instanceof Node\Identifier
        && in_array($node->name->toString(), ARRAY_FINDS, true)) {
        return true;
    }

    if (! $node instanceof MethodCall || ! $node->name instanceof Node\Identifier
        || ! in_array($node->name->toString(), ARRAY_WRITES, true)
        || ! isset($node->args[0]) || ! $node->args[0]->value instanceof Array_) {
        return false;
    }

    if (in_array($node->name->toString(), ['create', 'forceCreate'], true)) {
        return $node->var instanceof StaticCall && $node->var->name instanceof Node\Identifier
            && $node->var->name->toString() === 'query';
    }

    return $node->var instanceof Node\Expr\Variable;
}
