<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr\Throw_;
use PhpParser\Node\Identifier;
use PhpParser\Node\Stmt;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Expression;
use PhpParser\Node\Stmt\Foreach_;
use PhpParser\Node\Stmt\If_;
use PhpParser\Node\Stmt\Return_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The methods whose only purpose is to throw when something does not hold, yet are named require, ensure, check,
 * guard or refuse: such a method returns void, throws, and does nothing else, so it is named assert<What> (rule 47).
 * Found by `Class::method`.
 *
 * @implements FileScan<string>
 */
final readonly class ThrowOnlyGuards implements FileScan
{
    private const string GUARD_NAME = '/^(require|ensure|check|guard|refuse)[A-Z]/';

    public function key(): string
    {
        return 'throw-only-guards-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $found = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, ClassLike::class) as $type) {
            foreach ($type->getMethods() as $method) {
                if (self::isThrowOnlyGuard($method)) {
                    $found[] = sprintf('%s::%s', $type->namespacedName?->toString() ?? $type->name, $method->name);
                }
            }
        }

        return $found;
    }

    /**
     * Whether the method is named as a guard, returns void and its body only throws or returns.
     */
    public static function isThrowOnlyGuard(ClassMethod $method): bool
    {
        $returnsVoid = $method->returnType instanceof Identifier && $method->returnType->toLowerString() === 'void';
        $body = $method->stmts ?? [];
        $hasGuardName = preg_match(self::GUARD_NAME, $method->name->toString()) === 1;

        return $hasGuardName && $returnsVoid && $body !== [] && self::onlyThrows($body) && self::containsThrow($body);
    }

    /**
     * @param  array<Stmt>  $statements
     */
    private static function onlyThrows(array $statements): bool
    {
        return array_all($statements, fn (Stmt $statement) => self::isThrowOnly($statement));
    }

    private static function isThrowOnly(Stmt $statement): bool
    {
        return match (true) {
            $statement instanceof Expression => $statement->expr instanceof Throw_,
            $statement instanceof Return_ => $statement->expr === null,
            $statement instanceof If_ => self::hasThrowOnlyBranches($statement),
            $statement instanceof Foreach_ => self::onlyThrows($statement->stmts),
            default => false,
        };
    }

    private static function hasThrowOnlyBranches(If_ $branch): bool
    {
        $arms = [$branch->stmts, ...array_map(fn (Node $arm) => $arm->stmts, $branch->elseifs)];

        if ($branch->else !== null) {
            $arms[] = $branch->else->stmts;
        }

        return array_all($arms, fn (array $statements) => self::onlyThrows($statements));
    }

    /**
     * @param  array<Stmt>  $statements
     */
    private static function containsThrow(array $statements): bool
    {
        return new NodeFinder()->findFirstInstanceOf($statements, Throw_::class) !== null;
    }
}
