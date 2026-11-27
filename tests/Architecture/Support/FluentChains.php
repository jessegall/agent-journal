<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use FilesystemIterator;
use Illuminate\Database\Eloquent\Model;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * The faults of rule 115 in a set of classes: a public method of a fluent class that hands back another fluent class
 * switches the chain's subject, and a verb that names an inner subject flattens it. A fluent class is one, neither a
 * model nor a readonly value, that declares a public method returning itself; a getter that ends a chain is named for
 * what it gives back.
 */
final readonly class FluentChains
{
    /**
     * The words of an inner subject a flattened verb carries in its name.
     */
    private const string FLATTENED = '/On(TestHost|HostProcess|Mock)|TestHost(?!$)|MockTurns/';

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

                if (Reflector::exists($class) && Reflector::of($class)->isClass()) {
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
                $name = Reflector::of($class)->shortName().'::'.$method->name();
                $switches = $returned !== null && $returned !== $class && in_array($returned, $fluent, true);

                if ($switches && ! self::isGetter($method)) {
                    $faults[] = "{$name} switches the chain to {$returned}";
                }

                $flattens = preg_match(self::FLATTENED, $method->name()) === 1;

                if ($flattens && ! in_array($method->name(), self::SCOPE_VERBS, true)) {
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
        // A row is no chain's subject: a model's own changes answer it, never a chain of verbs on it. Nor is a readonly
        // value: what it hands back of its own class is a new value, never the same subject changed.
        $type = Reflector::of($class);

        if ($type->isSubclassOf(Model::class) || $type->isReadOnly()) {
            return false;
        }

        foreach (self::publicMethods($class) as $method) {
            $returnsItself = $method->returnType()
                ->map(fn (DeclaredType $type) => $type->isNamed()
                    && in_array($type->name(), ['self', 'static', $class], true))
                ->getOrElse(false);

            if ($returnsItself) {
                return true;
            }
        }

        return false;
    }

    /**
     * A getter that ends a chain is named for what it gives back: a row called by a name, a row of another, a service
     * or a fixture builder.
     */
    private static function isGetter(ReflectedMethod $method): bool
    {
        $name = $method->name();

        return str_ends_with($name, 'Called') || str_ends_with($name, 'Of') || in_array($name, ['service', 'fixtures'], true);
    }

    /**
     * The class the method hands back; none for one of PHP's own types, itself or no single named type.
     *
     * @return class-string|null
     */
    private static function returnedClass(ReflectedMethod $method): string|null
    {
        return $method->returnType()
            ->filter(fn (DeclaredType $type) => $type->isNamed()
                && ! $type->isBuiltin()
                && ! in_array($type->name(), ['self', 'static'], true))
            ->map(fn (DeclaredType $type) => $type->className())
            ->getOrElse(null);
    }

    /**
     * The public methods the class declares itself, neither static nor its constructor.
     *
     * @param  class-string  $class
     * @return list<ReflectedMethod>
     */
    private static function publicMethods(string $class): array
    {
        $type = Reflector::of($class);

        if ($type->isInterface() || $type->isTrait() || $type->isEnum()) {
            return [];
        }

        return array_values(array_filter(
            $type->methods(),
            fn (ReflectedMethod $method) => $method->isPublic()
                && ! $method->isStatic()
                && $method->name() !== '__construct'
                && $method->declaringClass()->name() === $class,
        ));
    }
}
