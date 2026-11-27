<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use FilesystemIterator;
use Illuminate\Database\Eloquent\Model;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;

/**
 * The faults of rule 115 in a set of classes: a public method of a fluent class that hands back another fluent class
 * switches the chain's subject, and a verb that names an inner subject flattens it. A fluent class is one, not a
 * model, that declares a public method returning itself; a getter that ends a chain is named for what it gives back.
 */
final readonly class FluentChains
{
    /**
     * The words of an inner subject a flattened verb carries in its name.
     */
    private const string FLATTENED = '/On(TestHost|HostProcess|Mock)|StandIn|TestHost(?!$)|MockTurns/';

    /**
     * Verbs that carry a subject's word as the scope verb of that subject itself.
     */
    private const array SCOPE_VERBS = ['runTestHost', 'testHost'];

    /**
     * @param  list<class-string>  $classes
     */
    public function __construct(private array $classes) {}

    /**
     * The classes the PHP files under the folders declare, read through the PSR-4 map of the root.
     *
     * @param  array<string, string>  $namespaces  each namespace prefix by its folder
     */
    public static function inFolders(array $namespaces): self
    {
        $classes = [];

        foreach ($namespaces as $folder => $namespace) {
            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folder, FilesystemIterator::SKIP_DOTS));

            foreach ($files as $file) {
                if ($file->getExtension() !== 'php') {
                    continue;
                }

                $class = $namespace.str_replace('/', '\\', substr($file->getPathname(), strlen($folder) + 1, -4));

                if (class_exists($class)) {
                    $classes[] = $class;
                }
            }
        }

        sort($classes);

        return new self($classes);
    }

    /**
     * Each fault as Class::method and what is wrong with it.
     *
     * @return list<string>
     */
    public function faults(): array
    {
        $fluent = array_values(array_filter($this->classes, fn (string $class) => self::isFluent($class)));
        $faults = [];

        foreach ($fluent as $class) {
            foreach (self::publicMethods($class) as $method) {
                $returned = self::returnedClass($method);
                $name = new ReflectionClass($class)->getShortName().'::'.$method->getName();

                if ($returned !== null && $returned !== $class && in_array($returned, $fluent, true) && ! self::isGetter($method)) {
                    $faults[] = "{$name} switches the chain to {$returned}";
                }

                if (preg_match(self::FLATTENED, $method->getName()) === 1 && ! in_array(
                    $method->getName(),
                    self::SCOPE_VERBS,
                    true,
                )) {
                    $faults[] = "{$name} names an inner subject: open that subject in a scope";
                }
            }
        }

        return $faults;
    }

    /**
     * @param  class-string  $class
     */
    private static function isFluent(string $class): bool
    {
        // A row is no chain's subject: a model's own changes answer it, never a chain of verbs on it.
        if (is_subclass_of($class, Model::class)) {
            return false;
        }

        foreach (self::publicMethods($class) as $method) {
            $type = $method->getReturnType();

            if ($type instanceof ReflectionNamedType && in_array($type->getName(), ['self', 'static', $class], true)) {
                return true;
            }
        }

        return false;
    }

    /**
     * A getter that ends a chain is named for what it gives back: a thing called by a name, a thing of another, a
     * service or a fixture builder.
     */
    private static function isGetter(ReflectionMethod $method): bool
    {
        $name = $method->getName();

        return str_ends_with($name, 'Called') || str_ends_with($name, 'Of') || in_array($name, ['service', 'fixtures'], true);
    }

    /**
     * @return class-string|null
     */
    private static function returnedClass(ReflectionMethod $method): string|null
    {
        $type = $method->getReturnType();

        if (! $type instanceof ReflectionNamedType || $type->isBuiltin() || in_array(
            $type->getName(),
            ['self', 'static'],
            true,
        )) {
            return null;
        }

        return $type->getName();
    }

    /**
     * @param  class-string  $class
     * @return list<ReflectionMethod>
     */
    private static function publicMethods(string $class): array
    {
        $type = new ReflectionClass($class);

        if ($type->isInterface() || $type->isTrait() || $type->isEnum()) {
            return [];
        }

        return array_values(array_filter(
            $type->getMethods(ReflectionMethod::IS_PUBLIC),
            fn (ReflectionMethod $method) => ! $method->isStatic()
                && ! $method->isConstructor()
                && $method->getDeclaringClass()->getName() === $class,
        ));
    }
}
