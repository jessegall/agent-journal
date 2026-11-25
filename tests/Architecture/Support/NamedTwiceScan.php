<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The chains that make a record under a name and read it back by the same name at once: a call x('A', ...) followed
 * directly by xCalled('A'), each with its line, the naming verb and the name. A reader after other steps reads the
 * record as those steps left it, which a create verb cannot give, so it passes.
 *
 * @implements FileScan<array{line: int, verb: string, name: string}>
 */
final readonly class NamedTwiceScan implements FileScan
{
    private const string READER_SUFFIX = 'Called';

    public function key(): string
    {
        return 'named-twice-2';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $found = [];

        /**
         * @var list<Expr\MethodCall> $readers
         */
        $readers = new NodeFinder()->find($file->statements, fn (Node $node) => self::isReader($node));

        foreach ($readers as $reader) {
            $name = self::firstLiteral($reader);
            $verb = substr((string) $reader->name, 0, -strlen(self::READER_SUFFIX));

            if (self::isMadeJustBefore($reader->var, $verb, $name)) {
                $found[] = ['line' => $reader->getStartLine(), 'verb' => $verb, 'name' => $name];
            }
        }

        return $found;
    }

    private static function isReader(Node $node): bool
    {
        return $node instanceof Expr\MethodCall
            && $node->name instanceof Node\Identifier
            && str_ends_with($node->name->toString(), self::READER_SUFFIX)
            && strlen($node->name->toString()) > strlen(self::READER_SUFFIX)
            && self::firstLiteral($node) !== '';
    }

    /**
     * Whether the call just before the reader is the naming verb with the same first literal.
     */
    private static function isMadeJustBefore(Expr $before, string $verb, string $name): bool
    {
        return $before instanceof Expr\MethodCall
            && $before->name instanceof Node\Identifier
            && $before->name->toString() === $verb
            && self::firstLiteral($before) === $name;
    }

    private static function firstLiteral(Expr\MethodCall $call): string
    {
        $first = $call->getArgs()[0] ?? null;

        return $first !== null && $first->value instanceof String_ ? $first->value->value : '';
    }
}
