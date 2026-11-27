<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Scalar;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * What a state's lifecycle, hook and fact methods and a listener's handle method give back, read from the syntax
 * tree: each one declared to return an array, and each return or yield of an array or a plain value. Such a method
 * gives nothing, a command or an event returned straight, or several yielded; a hook may give its answer parts too.
 *
 * @implements FileScan<string>
 */
final readonly class StateReturnScan implements FileScan
{
    private const string LISTENERS = '\\Listeners\\';

    public function key(): string
    {
        return 'state-returns-5';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Stmt\Class_::class) as $class) {
            $isState = $class->extends?->toString() === StateEffectScan::STATE;
            $isListener = str_contains((string) $class->namespacedName?->toString(), self::LISTENERS);

            foreach ($class->getMethods() as $method) {
                if (self::isJudged($method, $isState, $isListener)) {
                    array_push($findings, ...self::faultsOf($method));
                }
            }
        }

        return $findings;
    }

    private static function isJudged(Stmt\ClassMethod $method, bool $isState, bool $isListener): bool
    {
        $name = $method->name->toString();

        if ($isState) {
            return $method->isPublic() && preg_match('/^on[A-Z]/', $name) === 1;
        }

        return $isListener && $name === 'handle';
    }

    /**
     * @return list<string>
     */
    private static function faultsOf(Stmt\ClassMethod $method): array
    {
        $name = $method->name->toString();
        $faults = [];

        if ($method->returnType !== null && self::namesArray($method->returnType)) {
            $faults[] = "{$method->getStartLine()} {$name} declares an array";
        }

        if ($method->returnType !== null && self::namesBuiltin($method->returnType, 'iterable')) {
            $faults[] = "{$method->getStartLine()} {$name} declares an iterable, not a Generator";
        }

        foreach (self::ownNodes($method->stmts ?? []) as $node) {
            if ($node instanceof Expr\YieldFrom) {
                $faults[] = "{$node->getStartLine()} {$name} yields from elsewhere: yield each answer here";
            }
        }

        if (self::yieldsOnceAlways($method)) {
            $faults[] = "{$method->getStartLine()} {$name} always yields its one answer: return it";
        }

        foreach (self::ownNodes($method->stmts ?? []) as $node) {
            $given = match (true) {
                $node instanceof Stmt\Return_ => $node->expr,
                $node instanceof Expr\Yield_ => $node->value,
                default => null,
            };

            if ($given instanceof Expr\Array_) {
                $faults[] = "{$node->getStartLine()} {$name} gives an array";
            }

            if ($given instanceof Scalar || self::isBoolean($given)) {
                $faults[] = "{$node->getStartLine()} {$name} gives a plain value";
            }
        }

        return $faults;
    }

    private static function namesArray(Node $type): bool
    {
        return self::namesBuiltin($type, 'array');
    }

    private static function namesBuiltin(Node $type, string $builtin): bool
    {
        return match (true) {
            $type instanceof Node\Identifier => strtolower($type->toString()) === $builtin,
            $type instanceof Node\UnionType, $type instanceof Node\IntersectionType => array_any(
                $type->types,
                fn (Node $member) => self::namesBuiltin($member, $builtin),
            ),
            $type instanceof Node\NullableType => self::namesBuiltin($type->type, $builtin),
            default => false,
        };
    }

    /**
     * Whether the method yields exactly once, from a statement of its own body that always runs and with no return
     * before it: one answer, which is returned, not yielded.
     */
    private static function yieldsOnceAlways(Stmt\ClassMethod $method): bool
    {
        $own = self::ownNodes($method->stmts ?? []);
        $yields = array_filter($own, fn (Node $node) => $node instanceof Expr\Yield_ || $node instanceof Expr\YieldFrom);
        $topLevel = array_filter(
            $method->stmts ?? [],
            fn (Stmt $statement) => $statement instanceof Stmt\Expression && $statement->expr instanceof Expr\Yield_,
        );

        $returns = array_filter($own, fn (Node $node) => $node instanceof Stmt\Return_);

        return count($yields) === 1 && count($topLevel) === 1 && $returns === [];
    }

    private static function isBoolean(Node|null $given): bool
    {
        return $given instanceof Expr\ConstFetch
            && in_array(strtolower($given->name->toString()), ['true', 'false'], true);
    }

    /**
     * The nodes of the method's own body, leaving out the closures and functions written inside it.
     *
     * @param  array<Node>  $nodes
     * @return list<Node>
     */
    private static function ownNodes(array $nodes): array
    {
        $own = [];

        foreach ($nodes as $node) {
            if ($node instanceof Expr\Closure || $node instanceof Expr\ArrowFunction || $node instanceof Stmt\Function_) {
                continue;
            }

            $own[] = $node;

            foreach ($node->getSubNodeNames() as $subName) {
                $sub = $node->{$subName};
                array_push($own, ...self::ownNodes(array_values(array_filter(
                    is_array($sub) ? $sub : [$sub],
                    fn (mixed $child) => $child instanceof Node,
                ))));
            }
        }

        return $own;
    }
}
