<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The method and static calls of a file, each with its line, the method name and, for a static call or a call on a
 * named class, the class it names.
 *
 * @implements FileScan<array{line: int, method: string, class: string|null}>
 */
final readonly class CallScan implements FileScan
{
    public function key(): string
    {
        return 'calls-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return self::of($file);
    }

    /**
     * @return list<array{line: int, method: string, class: string|null}>
     */
    public static function of(ParsedFile $file): array
    {
        $calls = [];

        /** @var list<Expr\MethodCall|Expr\StaticCall|Expr\NullsafeMethodCall> $found */
        $found = new NodeFinder()->find($file->statements, fn (Node $node) => $node instanceof Expr\MethodCall || $node instanceof Expr\StaticCall || $node instanceof Expr\NullsafeMethodCall);

        foreach ($found as $call) {
            if (! $call->name instanceof Node\Identifier) {
                continue;
            }

            $class = $call instanceof Expr\StaticCall && $call->class instanceof Node\Name ? $call->class->toString() : null;
            $calls[] = ['line' => $call->getStartLine(), 'method' => $call->name->toString(), 'class' => $class];
        }

        return $calls;
    }
}
