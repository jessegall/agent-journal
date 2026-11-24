<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Models\Sharing\Share;
use App\Support\Reflector;
use App\Support\Registry;
use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\FunctionLike;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use PhpParser\PrettyPrinter\Standard;
use Tests\Support\ScanCache\FileScan;

/**
 * The static calls of a file that should go through an instance: one class and method called again with the same
 * arguments in one function body, and a static Reflector call inside an instance method of a class the container
 * builds, which takes the ReflectorFactory instead.
 *
 * @implements FileScan<array{line: int, call: string, reason: string}>
 */
final readonly class StaticFactoryScan implements FileScan
{
    public const string REPEATED = 'repeated';

    public const string INJECTABLE = 'injectable';

    /**
     * The Reflector's static answers that make no Reflector, so a class the container builds asks them of the
     * Reflector itself: whether a name loads.
     */
    private const array NOT_FACTORIES = ['exists'];

    /**
     * Static calls that must run each time: each builds a new mutable store or reads rows, so holding the first answer
     * would share one store between two owners or keep a stale read.
     */
    private const array FRESH_EACH_CALL = [
        Registry::class.'::once',
        Registry::class.'::replacing',
        Share::class.'::liveFor',
    ];

    public function key(): string
    {
        return 'static-factories-5';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $printer = new Standard();
        $findings = [];

        /** @var list<FunctionLike&Node> $functions */
        $functions = new NodeFinder()->findInstanceOf($file->statements, FunctionLike::class);

        foreach ($functions as $function) {
            $seen = [];

            foreach (self::ownStaticCalls($function) as $call) {
                if (! $call->class instanceof Node\Name || ! $call->name instanceof Node\Identifier) {
                    continue;
                }

                $printed = $call->class->toString().'::'.$call->name->toString();

                if ($call->class->toString() === Reflector::class
                    && ! in_array($call->name->toString(), self::NOT_FACTORIES, true)
                    && self::isInjectableInstanceMethod($function)) {
                    $findings[] = ['line' => $call->getStartLine(), 'call' => $printed, 'reason' => self::INJECTABLE];
                }

                if ($call->args === []
                    || $call->isFirstClassCallable()
                    || $call->class->isSpecialClassName()
                    || self::buildsAFailure($call->class)
                    || in_array($printed, self::FRESH_EACH_CALL, true)) {
                    continue;
                }

                $arguments = array_map(
                    fn (Node\Arg|Node\ArgPlaceholder|Node\VariadicPlaceholder $argument) => $argument instanceof Node\Arg
                        ? ($argument->name === null ? '' : $argument->name->toString().': ')
                            .$printer->prettyPrintExpr($argument->value)
                        : '...',
                    $call->args,
                );
                $key = $printed.'('.implode(', ', $arguments).')';

                if (isset($seen[$key])) {
                    $findings[] = ['line' => $call->getStartLine(), 'call' => $key, 'reason' => self::REPEATED];

                    continue;
                }

                $seen[$key] = true;
            }
        }

        return $findings;
    }

    /**
     * The static calls a function makes itself, leaving out those of a closure or function nested in it.
     *
     * @return list<Expr\StaticCall>
     */
    private static function ownStaticCalls(FunctionLike $function): array
    {
        $calls = [];
        $pending = $function->getStmts() ?? [];

        if ($function instanceof Expr\ArrowFunction) {
            $pending = [$function->expr];
        }

        while ($pending !== []) {
            $node = array_shift($pending);

            if (! $node instanceof Node || $node instanceof FunctionLike || $node instanceof Stmt\ClassLike) {
                continue;
            }

            if ($node instanceof Expr\StaticCall) {
                $calls[] = $node;
            }

            foreach ($node->getSubNodeNames() as $name) {
                $child = $node->{$name};
                array_push($pending, ...(is_array($child) ? $child : [$child]));
            }
        }

        usort($calls, fn (Expr\StaticCall $left, Expr\StaticCall $right) => $left->getStartFilePos() <=> $right->getStartFilePos());

        return $calls;
    }

    /**
     * Whether the class is a named exception, whose factory is called where it is thrown: two branches that throw the
     * same failure each build their own.
     */
    private static function buildsAFailure(Node\Name $class): bool
    {
        return str_contains($class->toString(), '\\Exceptions\\');
    }

    /**
     * Whether the function is an instance method of a class the container builds: one whose constructor hides a
     * service in a private or protected promoted parameter typed by a class or interface, and which is neither an
     * attribute nor a PHPStan rule. A value object, whose constructor takes public data, scalars, arrays or closures,
     * is made with new and keeps its static Reflector calls.
     */
    private static function isInjectableInstanceMethod(FunctionLike $function): bool
    {
        if (! $function instanceof Stmt\ClassMethod || $function->isStatic()) {
            return false;
        }

        $class = $function->getAttribute('parent');

        if (! $class instanceof Stmt\Class_) {
            return false;
        }

        $constructor = $class->getMethod('__construct');

        if ($constructor === null || ! array_any($constructor->params, self::isHiddenService(...))) {
            return false;
        }

        foreach ($class->attrGroups as $group) {
            foreach ($group->attrs as $attribute) {
                if ($attribute->name->toString() === 'Attribute') {
                    return false;
                }
            }
        }

        foreach ($class->implements as $contract) {
            if (str_starts_with($contract->toString(), 'PHPStan\\')) {
                return false;
            }
        }

        return true;
    }

    /**
     * Whether the constructor parameter is a service the class keeps to itself: promoted as private or protected and
     * typed by a class or interface other than Closure.
     */
    private static function isHiddenService(Node\Param $parameter): bool
    {
        $hidden = ($parameter->flags & (Stmt\Class_::MODIFIER_PRIVATE | Stmt\Class_::MODIFIER_PROTECTED)) !== 0;
        $type = $parameter->type instanceof Node\NullableType ? $parameter->type->type : $parameter->type;

        return $hidden && $type instanceof Node\Name && $type->toLowerString() !== 'closure';
    }
}
