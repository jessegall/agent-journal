<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr\Array_;
use PhpParser\Node\Expr\FuncCall;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Every call that hands a literal name and a literal array keyed by name on, as route() and its wrappers do, as
 * "<name>|<string keys, comma joined>|<path>:<line>"; RouteParametersTest keeps those whose name is a route.
 *
 * @implements FileScan<string>
 */
final readonly class RouteNameCallsScan implements FileScan
{
    public function key(): string
    {
        return 'route-name-calls-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $calls = new NodeFinder()->find(
            $file->statements,
            fn (Node $node) => ($node instanceof FuncCall || $node instanceof MethodCall || $node instanceof StaticCall)
                && ! $node->isFirstClassCallable()
                && count($node->getArgs()) >= 2
                && $node->getArgs()[0]->value instanceof String_
                && $node->getArgs()[1]->value instanceof Array_
                && array_all(
                    $node->getArgs()[1]->value->items,
                    fn (Node\ArrayItem $item) => $item->key instanceof String_,
                ),
        );

        return array_values(array_map(fn (Node $call) => self::findingOf($file, $call), $calls));
    }

    private static function findingOf(ParsedFile $file, Node $call): string
    {
        assert($call instanceof FuncCall || $call instanceof MethodCall || $call instanceof StaticCall);
        $name = $call->getArgs()[0]->value;
        $array = $call->getArgs()[1]->value;
        assert($name instanceof String_ && $array instanceof Array_);
        $keys = [];

        foreach ($array->items as $item) {
            if ($item->key instanceof String_) {
                $keys[] = $item->key->value;
            }
        }

        return "{$name->value}|".implode(',', $keys)."|{$file->path}:{$call->getStartLine()}";
    }
}
