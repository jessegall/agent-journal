<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Each json_decode of a file and, when its result is handed straight to a static call, the class and method that
 * take it: Data::from(json_decode(...)) reads as ['class' => Data, 'method' => 'from'].
 *
 * @implements FileScan<array{line: int, class: string|null, method: string|null}>
 */
final readonly class JsonDecodeScan implements FileScan
{
    public function key(): string
    {
        return 'json-decodes-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Expr\FuncCall::class) as $call) {
            if (! $call->name instanceof Node\Name || $call->name->toLowerString() !== 'json_decode') {
                continue;
            }

            $argument = $call->getAttribute('parent');
            $taker = $argument instanceof Node\Arg ? $argument->getAttribute('parent') : null;
            $isStatic = $taker instanceof Expr\StaticCall
                && $taker->class instanceof Node\Name
                && $taker->name instanceof Node\Identifier;

            $findings[] = [
                'line' => $call->getStartLine(),
                'class' => $isStatic ? $taker->class->toString() : null,
                'method' => $isStatic ? $taker->name->toString() : null,
            ];
        }

        return $findings;
    }
}
