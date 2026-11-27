<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The methods of a model's Mutations section that write the model's own row and raise no event, directly or through
 * the model's own methods, each as Class::method.
 *
 * @implements FileScan<string>
 */
final readonly class SilentMutationScan implements FileScan
{
    /**
     * The model's own helpers that write its row, besides Eloquent's writes.
     */
    private const array OWN_WRITES = ['saveAndAssert', 'deleteAndAssert', 'insertIfAbsent', 'saveOrFail'];

    private const string RAISE = 'raise';

    public function key(): string
    {
        return 'silent-mutations-2';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $silent = [];
        $sections = ModelSections::of($file->code);

        foreach (new NodeFinder()->findInstanceOf($file->statements, Class_::class) as $class) {
            $methods = $this->methodsOf($class);

            foreach ($methods as $name => $method) {
                if ($class->name === null || ! $sections->isMutation($method)) {
                    continue;
                }

                if ($this->reaches($name, $methods, $this->writesItsRow(...))
                    && ! $this->reaches($name, $methods, $this->raises(...))) {
                    $silent[] = $class->name->toString().'::'.$name;
                }
            }
        }

        return $silent;
    }

    /**
     * @return array<string, ClassMethod>
     */
    private function methodsOf(Class_ $class): array
    {
        $methods = [];

        foreach ($class->getMethods() as $method) {
            $methods[$method->name->toString()] = $method;
        }

        return $methods;
    }

    /**
     * Whether the method, or a method of its own class it calls on $this, holds a call the check accepts.
     *
     * @param  array<string, ClassMethod>  $methods
     * @param  callable(Node): bool  $check
     * @param  list<string>  $seen
     */
    private function reaches(string $name, array $methods, callable $check, array $seen = []): bool
    {
        if (in_array($name, $seen, true) || ! isset($methods[$name])) {
            return false;
        }

        $calls = new NodeFinder()->find($methods[$name]->stmts ?? [], fn (Node $node) => $this->isOwnCall($node));

        foreach ($calls as $call) {
            if ($check($call)) {
                return true;
            }
        }

        foreach ($calls as $call) {
            if ($call instanceof MethodCall && $call->name instanceof Identifier
                && $this->reaches($call->name->toString(), $methods, $check, [...$seen, $name])) {
                return true;
            }
        }

        return false;
    }

    private function isOwnCall(Node $node): bool
    {
        if ($node instanceof MethodCall) {
            return $node->var instanceof Variable && $node->var->name === 'this';
        }

        return $node instanceof StaticCall && $node->class instanceof Name
            && in_array($node->class->toLowerString(), ['static', 'self'], true);
    }

    private function writesItsRow(Node $call): bool
    {
        $name = $this->calledName($call);

        return ModelWriteScan::isWrite($name) || in_array($name, self::OWN_WRITES, true);
    }

    private function raises(Node $call): bool
    {
        return $this->calledName($call) === self::RAISE;
    }

    private function calledName(Node $call): string
    {
        return ($call instanceof MethodCall || $call instanceof StaticCall) && $call->name instanceof Identifier
            ? $call->name->toString()
            : '';
    }
}
