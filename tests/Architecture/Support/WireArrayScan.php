<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Every toArray() call handed straight to a wire sink, a JSON response or an MCP tool result, which turns a Data into
 * an array itself.
 *
 * @implements FileScan<array{line: int, sink: string}>
 */
final readonly class WireArrayScan implements FileScan
{
    private const array RESPONSE_CLASSES = [
        'JsonResponse',
        'Illuminate\\Http\\JsonResponse',
        'Symfony\\Component\\HttpFoundation\\JsonResponse',
    ];

    public function key(): string
    {
        return 'wire-arrays-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Expr\MethodCall::class) as $call) {
            if (! $call->name instanceof Node\Identifier || $call->name->toString() !== 'toArray' || $call->args !== []) {
                continue;
            }

            $argument = $call->getAttribute('parent');
            $sink = $argument instanceof Node\Arg ? self::sinkOf($argument->getAttribute('parent')) : null;

            if ($sink !== null) {
                $findings[] = ['line' => $call->getStartLine(), 'sink' => $sink];
            }
        }

        return $findings;
    }

    /**
     * The wire sink the call that takes the argument is, or none.
     */
    private static function sinkOf(mixed $receiver): string|null
    {
        if ($receiver instanceof Expr\New_ && $receiver->class instanceof Node\Name
            && in_array($receiver->class->toString(), self::RESPONSE_CLASSES, true)) {
            return 'new JsonResponse';
        }

        if ($receiver instanceof Expr\StaticCall && $receiver->class instanceof Node\Name
            && $receiver->class->getLast() === 'ToolResult' && $receiver->name instanceof Node\Identifier
            && $receiver->name->toString() === 'ok') {
            return 'ToolResult::ok';
        }

        return null;
    }
}
