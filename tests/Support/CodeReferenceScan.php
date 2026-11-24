<?php

declare(strict_types=1);

namespace Tests\Support;

use PhpParser\Node\Expr\Array_;
use PhpParser\Node\Expr\CallLike;
use PhpParser\Node\Expr\ClassConstFetch;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use Tests\Architecture\Support\ParsedFile;
use Tests\Support\ScanCache\FileScan;

/**
 * What one file's syntax tree says about its classes: each class it declares, each class it names, what each class
 * serves (the interfaces it implements and the commands or events its handle method takes), the classes one call names
 * together (a container binding, a listener registration), and each test method it holds.
 *
 * @implements FileScan<string>
 */
final readonly class CodeReferenceScan implements FileScan
{
    public const string DECLARES = 'declares ';

    public const string NAMES = 'names ';

    public const string SERVES = 'serves ';

    /**
     * The classes one call names together, separated by spaces, such as an interface and the class bound to it.
     */
    public const string LINKS = 'links ';

    public const string TEST = 'test ';

    private const string TEST_ATTRIBUTE = 'PHPUnit\Framework\Attributes\Test';

    /**
     * The methods whose parameter types name what a handler or listener serves.
     */
    private const array HANDLING_METHODS = ['handle', '__invoke'];

    public function key(): string
    {
        return 'code-references-2';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $findings = [];

        foreach ($finder->findInstanceOf($file->statements, ClassLike::class) as $class) {
            if ($class->namespacedName !== null) {
                $findings[] = self::DECLARES.$class->namespacedName->toString();
            }

            if ($class instanceof Class_) {
                foreach ($class->implements as $interface) {
                    $findings[] = self::SERVES.$interface->toString();
                }
            }

            foreach ($class->getMethods() as $method) {
                if ($this->isTest($method)) {
                    $findings[] = self::TEST.$method->name->toString();
                }

                foreach ($this->handledTypesOf($method) as $handled) {
                    $findings[] = self::SERVES.$handled;
                }
            }
        }

        foreach ($finder->findInstanceOf($file->statements, CallLike::class) as $call) {
            $linked = $this->classesNamedTogetherBy($call);

            if (count($linked) > 1) {
                $findings[] = self::LINKS.implode(' ', $linked);
            }
        }

        $names = array_map(
            fn (Name\FullyQualified $name) => $name->toString(),
            $finder->findInstanceOf($file->statements, Name\FullyQualified::class),
        );

        foreach (array_unique($names) as $name) {
            $findings[] = self::NAMES.$name;
        }

        return $findings;
    }

    /**
     * The classes a handle or invoke method takes, which its class serves.
     *
     * @return list<string>
     */
    private function handledTypesOf(ClassMethod $method): array
    {
        if (! in_array($method->name->toString(), self::HANDLING_METHODS, true)) {
            return [];
        }

        $types = [];

        foreach ($method->params as $parameter) {
            if ($parameter->type instanceof Name) {
                $types[] = $parameter->type->toString();
            }
        }

        return $types;
    }

    /**
     * The classes a call names as X::class among its arguments, directly or in an array argument.
     *
     * @return list<string>
     */
    private function classesNamedTogetherBy(CallLike $call): array
    {
        if ($call->isFirstClassCallable()) {
            return [];
        }

        $values = [];

        foreach ($call->getArgs() as $argument) {
            $values[] = $argument->value;

            if ($argument->value instanceof Array_) {
                foreach ($argument->value->items as $item) {
                    $values[] = $item->value;
                }
            }
        }

        $classes = [];

        foreach ($values as $value) {
            if ($value instanceof ClassConstFetch
                && $value->class instanceof Name
                && $value->name instanceof Identifier
                && $value->name->toString() === 'class') {
                $classes[] = $value->class->toString();
            }
        }

        return array_values(array_unique($classes));
    }

    private function isTest(ClassMethod $method): bool
    {
        if (! $method->isPublic()) {
            return false;
        }

        if (str_starts_with($method->name->toString(), 'test')) {
            return true;
        }

        foreach ($method->attrGroups as $group) {
            foreach ($group->attrs as $attribute) {
                if ($attribute->name->toString() === self::TEST_ATTRIBUTE) {
                    return true;
                }
            }
        }

        return false;
    }
}
