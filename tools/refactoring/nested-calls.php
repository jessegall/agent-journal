<?php

declare(strict_types=1);

/**
 * Lists the calls nested where they should be bound first: a row read (a query() chain that
 * ends in a find, first, sole, get or the like) passed straight into another call or new, and a null-safe call on
 * the result of another call, such as ChatMessage::findForSource(Question::query()->findOrFail($id))?->reload().
 * Bind the inner result, leave early when it is missing, then act. A query builder handed on as a subquery, chains
 * on one receiver, closures and plain values stay as they are.
 *
 *   php tools/refactoring/nested-calls.php app domain
 *       prints "file:line<TAB>..." for each such nesting, and fails while there is one.
 */

use PhpParser\Node;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\New_;
use PhpParser\Node\Expr\NullsafeMethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/** The last calls of a chain that read rows, as against a query builder handed on as a subquery. */
const ROW_READS = '/^(find\w*|first\w*|sole\w*|value|get|pluck|all|count|exists)$/';

main(array_slice($argv, 1));

/**
 * @param  list<string>  $paths
 */
function main(array $paths): void
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $finder = new NodeFinder();
    $faults = [];

    foreach ($paths as $path) {
        foreach (phpFiles($path) as $file) {
            if (preg_match('#(^|/)domain/[^/]+/tests/#', $file) === 1) {
                continue;
            }

            $nodes = parsedOnce($parser, $file, file_get_contents($file));

            foreach ($finder->find($nodes, fn (Node $node) => isCall($node) || $node instanceof New_) as $call) {
                array_push($faults, ...faultsOf($file, $call));
            }
        }
    }

    echo implode('', array_map(fn (string $fault) => $fault."\n", $faults));
    exit($faults === [] ? 0 : 1);
}

/**
 * The faults of one call: a row read among its arguments, and a null-safe call on another call's result.
 *
 * @return list<string>
 */
function faultsOf(string $file, Node $call): array
{
    $faults = [];

    if ($call instanceof NullsafeMethodCall && isCall($call->var)) {
        $faults[] = "{$file}:{$call->getStartLine()}\ta null-safe call on a call's result: bind the result, leave early "
            .'when it is missing, then call';
    }

    if ($call->isFirstClassCallable()) {
        return $faults;
    }

    foreach ($call->getArgs() as $argument) {
        if (readsRows($argument->value)) {
            $faults[] = "{$file}:{$argument->value->getStartLine()}\ta row read passed straight into another call: "
                .'bind it to a variable first';
        }
    }

    return $faults;
}

function isCall(Node $node): bool
{
    return $node instanceof MethodCall || $node instanceof NullsafeMethodCall || $node instanceof StaticCall;
}

/**
 * Whether the expression is a query chain that ends in a read: it starts at query() and its last call reads rows.
 */
function readsRows(Node $node): bool
{
    if (! isCall($node) || ! $node->name instanceof Node\Identifier) {
        return false;
    }

    if (preg_match(ROW_READS, $node->name->toString()) !== 1) {
        return false;
    }

    return startsAtQuery($node);
}

/**
 * Whether a call chain starts at a model's query().
 */
function startsAtQuery(Node $node): bool
{
    while (isCall($node) && ! $node instanceof StaticCall) {
        $node = $node->var;
    }

    return $node instanceof StaticCall && $node->name instanceof Node\Identifier
        && $node->name->toString() === 'query';
}
