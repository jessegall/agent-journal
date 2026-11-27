<?php

declare(strict_types=1);

/**
 * Lists the JSON a model or an Eloquent cast writes or reads by hand, which belongs to a Laravel Data cast instead. A
 * method marked #[DecodesAnyJson] is left to JsonIntoDataTest's list, and JSON handed straight to hash() is a digest.
 *
 *   php tools/refactoring/column-json.php app domain
 *       prints "file:line<TAB>..." for each such call, and fails while there is one.
 */

use PhpParser\Node;
use PhpParser\Node\Expr\FuncCall;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/** The parents and contracts of a class that keeps or casts a row's columns. */
const COLUMN_CLASSES = [
    'Model',
    'Pivot',
    'MorphPivot',
    'Authenticatable',
    'CastsAttributes',
];

main(array_slice($argv, 1));

/**
 * @param  list<string>  $paths
 */
function main(array $paths): void
{
    $finder = new NodeFinder();
    $faults = [];

    foreach ($paths as $path) {
        foreach (phpFiles($path) as $file) {
            if (preg_match('#(^|/)domain/[^/]+/tests/#', $file) === 1) {
                continue;
            }

            $code = file_get_contents($file);
            $nodes = parsedOnce($file, $code);

            foreach ($finder->findInstanceOf($nodes, Class_::class) as $class) {
                if (! keepsColumns($class)) {
                    continue;
                }

                foreach ($class->getMethods() as $method) {
                    if (decodesAnyJson($method)) {
                        continue;
                    }

                    $digests = digestedJson($finder, $method);

                    foreach ($finder->find($method, fn (Node $node) => isJsonCall($node)) as $call) {
                        if (in_array($call, $digests, true)) {
                            continue;
                        }

                        $faults[] = "{$file}:{$call->getStartLine()}\t{$class->name}::{$method->name} writes or reads "
                            .'JSON by hand: cast the column to its Data class and let Laravel Data do it';
                    }
                }
            }
        }
    }

    echo implode('', array_map(fn (string $fault) => $fault."\n", $faults));
    exit($faults === [] ? 0 : 1);
}

/**
 * Whether the class extends a model or implements an Eloquent cast.
 */
function keepsColumns(Class_ $class): bool
{
    $names = array_map(fn (Node\Name $name) => $name->getLast(), $class->implements);

    if ($class->extends !== null) {
        $names[] = $class->extends->getLast();
    }

    return array_intersect($names, COLUMN_CLASSES) !== [];
}

function decodesAnyJson(ClassMethod $method): bool
{
    foreach ($method->attrGroups as $group) {
        foreach ($group->attrs as $attribute) {
            if ($attribute->name->getLast() === 'DecodesAnyJson') {
                return true;
            }
        }
    }

    return false;
}

/**
 * The JSON calls handed straight to hash() in the method.
 *
 * @return list<Node>
 */
function digestedJson(NodeFinder $finder, ClassMethod $method): array
{
    $digests = [];

    foreach ($finder->find($method, fn (Node $node) => $node instanceof FuncCall && $node->name instanceof Node\Name
        && $node->name->getLast() === 'hash') as $hash) {
        foreach ($hash->getArgs() as $argument) {
            if (isJsonCall($argument->value)) {
                $digests[] = $argument->value;
            }
        }
    }

    return $digests;
}

function isJsonCall(Node $node): bool
{
    return $node instanceof FuncCall && $node->name instanceof Node\Name
        && in_array($node->name->getLast(), ['json_encode', 'json_decode'], true);
}
