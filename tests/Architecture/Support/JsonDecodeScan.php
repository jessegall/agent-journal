<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Attributes\DecodesAnyJson;
use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Each json_decode of a file and, when its result is handed straight to a static call, the class and method that
 * take it: Data::from(json_decode(...)) reads as ['class' => Data, 'method' => 'from']; 'marked' names the
 * Class::method around it when that method carries #[DecodesAnyJson].
 *
 * @implements FileScan<array{line: int, class: string|null, method: string|null, marked: string|null}>
 */
final readonly class JsonDecodeScan implements FileScan
{
    public function key(): string
    {
        return 'json-decodes-2';
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
                'marked' => self::markedMethod($call),
            ];
        }

        return $findings;
    }

    /**
     * The Class::method holding the call, when that method carries #[DecodesAnyJson].
     */
    private static function markedMethod(Node $node): string|null
    {
        $method = $node->getAttribute('parent');

        while ($method instanceof Node && ! $method instanceof Node\Stmt\ClassMethod) {
            $method = $method->getAttribute('parent');
        }

        if (! $method instanceof Node\Stmt\ClassMethod) {
            return null;
        }

        foreach ($method->attrGroups as $group) {
            foreach ($group->attrs as $attribute) {
                if ($attribute->name->toString() === DecodesAnyJson::class) {
                    $class = $method->getAttribute('parent');

                    return ($class instanceof Node\Stmt\Class_ && $class->namespacedName !== null
                        ? $class->namespacedName->toString() : '').'::'.$method->name->toString();
                }
            }
        }

        return null;
    }
}
