<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The calls that persist a live stack (insert, save its frames, close it) and, in a file that names the stack row, the
 * writes of its frames and status, each with its line.
 *
 * @implements FileScan<string>
 */
final readonly class StackWriteScan implements FileScan
{
    public const string ROW = 'App\\Hooks\\Models\\AgentStackRow';

    /**
     * The stack row's persisting methods, named only by the stack row.
     */
    private const array PERSISTING = ['insertIfMissing', 'saveFrames', 'closeAt'];

    /**
     * Persisting method names other classes share, judged only where the file names the stack row.
     */
    private const array SHARED_NAMES = ['startFor', 'setRawAttributes', 'forceFill', 'update'];

    private const array COLUMNS = ['frames', 'status'];

    public function key(): string
    {
        return 'stack-writes-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $namesRow = $finder->findFirst(
            $file->statements,
            fn (Node $node) => $node instanceof Node\Name && $node->toString() === self::ROW,
        ) !== null;
        $findings = [];

        foreach ($finder->find($file->statements, fn (Node $node) => self::persists($node, $namesRow)) as $node) {
            $findings[] = $node->getStartLine().' '.self::describe($node);
        }

        return $findings;
    }

    private static function persists(Node $node, bool $namesRow): bool
    {
        $isCall = $node instanceof Expr\MethodCall || $node instanceof Expr\StaticCall
            || $node instanceof Expr\NullsafeMethodCall;

        if ($isCall && $node->name instanceof Node\Identifier) {
            $name = self::identifier($node->name);

            return in_array($name, self::PERSISTING, true)
                || ($namesRow && in_array($name, self::SHARED_NAMES, true) && self::setsColumns($node));
        }

        return $namesRow && $node instanceof Expr\Assign && $node->var instanceof Expr\PropertyFetch
            && $node->var->name instanceof Node\Identifier && in_array(self::identifier($node->var->name), self::COLUMNS, true);
    }

    /**
     * A shared name counts when it is startFor, or when its array argument sets frames or status.
     */
    private static function setsColumns(Expr\MethodCall|Expr\StaticCall|Expr\NullsafeMethodCall $call): bool
    {
        if (self::identifier($call->name) === 'startFor') {
            return true;
        }

        foreach ($call->getArgs() as $argument) {
            if (! $argument->value instanceof Expr\Array_) {
                continue;
            }

            foreach ($argument->value->items as $item) {
                if ($item->key instanceof String_ && in_array($item->key->value, self::COLUMNS, true)) {
                    return true;
                }
            }
        }

        return false;
    }

    private static function describe(Node $node): string
    {
        if ($node instanceof Expr\Assign && $node->var instanceof Expr\PropertyFetch) {
            return 'writes '.self::identifier($node->var->name);
        }

        /** @var Expr\MethodCall|Expr\StaticCall|Expr\NullsafeMethodCall $node */
        return 'calls '.self::identifier($node->name);
    }

    private static function identifier(Expr|Node\Identifier $name): string
    {
        return $name instanceof Node\Identifier ? $name->toString() : '';
    }
}
