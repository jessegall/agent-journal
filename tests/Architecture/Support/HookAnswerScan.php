<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Where a class makes a hook answer, read from the syntax tree: a decision built (Decision::allow, deny, rewrite or
 * delegate), or a message line, context line or hook answer made. Each finding is "<line> <class> <what>"; the test
 * then refuses each class that is no HookDecider.
 *
 * @implements FileScan<string>
 */
final readonly class HookAnswerScan implements FileScan
{
    private const array DECISIONS = ['allow', 'deny', 'rewrite', 'delegate'];

    private const array ANSWER_PARTS = ['MessageLine', 'ContextLine', 'HookAnswer'];

    public function key(): string
    {
        return 'hook-answers-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];
        $finder = new NodeFinder();

        foreach ($finder->findInstanceOf($file->statements, Stmt\ClassLike::class) as $class) {
            $name = (string) $class->namespacedName?->toString();

            foreach ($finder->find($class->stmts, fn (Node $node) => self::madeAnswer($node) !== null) as $node) {
                $findings[] = "{$node->getStartLine()} {$name} ".self::madeAnswer($node);
            }
        }

        return $findings;
    }

    private static function madeAnswer(Node $node): string|null
    {
        if (
            $node instanceof Expr\StaticCall
            && $node->class instanceof Node\Name
            && $node->class->getLast() === 'Decision'
            && $node->name instanceof Node\Identifier
            && in_array($node->name->toString(), self::DECISIONS, true)
        ) {
            return "builds Decision::{$node->name->toString()}";
        }

        if ($node instanceof Expr\New_ && $node->class instanceof Node\Name) {
            $made = $node->class->getLast();

            return in_array($made, self::ANSWER_PARTS, true) ? "makes a {$made}" : null;
        }

        return null;
    }
}
