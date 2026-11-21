<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Exceptions\ClassMissing;
use App\Reflection\Exceptions\MethodMissing;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use ReflectionClass;
use ReflectionMethod;
use ReflectionProperty;

/**
 * What PHP declares about one class, interface, trait or enum, read once and kept for the life of the process.
 *
 * @template T of object
 */
final class Reflector
{
    use ReadsDeclaredAttributes;

    /**
     * @var ReflectionClass<T>
     */
    private readonly ReflectionClass $type;

    private readonly DeclarationAttributes $declaredAttributes;

    /**
     * @var list<ReflectedProperty>
     */
    private array $properties;

    /**
     * Each method asked for, by its lowercase name.
     *
     * @var array<string, ReflectedMethod>
     */
    private array $methods = [];

    /**
     * @var Option<ReflectedMethod>
     */
    private Option $constructor;

    /**
     * @var list<ReflectedMethod>
     */
    private array $allMethods;

    /**
     * @var Option<Reflector<object>>
     */
    private Option $parent;

    /**
     * @param  class-string<T>  $name
     */
    private function __construct(string $name)
    {
        $this->type = new ReflectionClass($name);
        $this->declaredAttributes = new DeclarationAttributes(
            fn () => $this->type->getAttributes(),
            "class {$this->type->getName()}",
        );
    }

    /**
     * The one Reflector of the target's type in this process.
     *
     * @template U of object
     *
     * @param  class-string<U>|U  $target
     * @return self<U>
     *
     * @throws ClassMissing
     */
    public static function of(string|object $target): self
    {
        $name = is_object($target) ? $target::class : $target;
        $reflector = ReflectionCatalogue::current()->reflector($name, fn (string $canonical) => new self($canonical));

        /**
         * The catalogue answers the Reflector of exactly the type the name names, which is U.
         *
         * @var self<U> $reflector
         */
        return $reflector;
    }

    /**
     * The type's name as PHP declared it.
     *
     * @return class-string<T>
     */
    public function name(): string
    {
        return $this->type->getName();
    }

    /**
     * The name without its namespace.
     */
    public function shortName(): string
    {
        return $this->type->getShortName();
    }

    public function namespaceName(): string
    {
        return $this->type->getNamespaceName();
    }

    /**
     * The file that declares the type; none for a class PHP or an extension declares.
     *
     * @return Option<string>
     */
    public function fileName(): Option
    {
        $file = $this->type->getFileName();

        return $file === false ? None::create() : new Some($file);
    }

    public function isAbstract(): bool
    {
        return $this->type->isAbstract();
    }

    public function isInterface(): bool
    {
        return $this->type->isInterface();
    }

    public function isEnum(): bool
    {
        return $this->type->isEnum();
    }

    public function isFinal(): bool
    {
        return $this->type->isFinal();
    }

    public function isReadOnly(): bool
    {
        return $this->type->isReadOnly();
    }

    /**
     * Whether new can build it: a class that is not abstract, an interface, a trait or an enum, with a public
     * constructor or none.
     */
    public function isInstantiable(): bool
    {
        return $this->type->isInstantiable();
    }

    /**
     * A new object of the class with no constructor run, built on every call and never kept.
     *
     * @return T
     */
    public function newInstanceWithoutConstructor(): object
    {
        return $this->type->newInstanceWithoutConstructor();
    }

    /**
     * Every property, its own and inherited, in the order PHP lists them.
     *
     * @return list<ReflectedProperty>
     */
    public function properties(): array
    {
        return $this->properties ??= array_map(
            fn (ReflectionProperty $property) => new ReflectedProperty($property),
            $this->type->getProperties(),
        );
    }

    public function hasProperty(string $name): bool
    {
        return $this->type->hasProperty($name);
    }

    public function hasMethod(string $name): bool
    {
        return $this->type->hasMethod($name);
    }

    /**
     * Every method, its own and inherited, in the order PHP lists them.
     *
     * @return list<ReflectedMethod>
     */
    public function methods(): array
    {
        return $this->allMethods ??= array_map(
            fn (ReflectionMethod $method) => $this->methods[strtolower($method->getName())] ??= new ReflectedMethod(
                $method,
            ),
            $this->type->getMethods(),
        );
    }

    /**
     * The class it extends; none for a class that extends nothing, an interface, a trait or an enum.
     *
     * @return Option<Reflector<object>>
     */
    public function parent(): Option
    {
        if (isset($this->parent)) {
            return $this->parent;
        }

        $parent = $this->type->getParentClass();

        return $this->parent = $parent === false ? None::create() : new Some(self::of($parent->getName()));
    }

    /**
     * This class and then each class it extends, nearest first, for a reader that walks the parents itself.
     *
     * @return list<Reflector<object>>
     */
    public function lineage(): array
    {
        return [$this, ...$this->parent()->map(fn (self $parent) => $parent->lineage())->getOrElse([])];
    }

    /**
     * The traits the class itself uses, in the order it names them; not those of its parents or of other traits.
     *
     * @return list<Reflector<object>>
     */
    public function traits(): array
    {
        return array_values(array_map(fn (string $trait) => self::of($trait), $this->type->getTraitNames()));
    }

    /**
     * The method of this name as PHP reflects it for this class: its own, an override, or the one it inherits.
     *
     * @throws MethodMissing
     */
    public function method(string $name): ReflectedMethod
    {
        if (! $this->hasMethod($name)) {
            throw MethodMissing::on($this->name(), $name);
        }

        return $this->methods[strtolower($name)] ??= new ReflectedMethod($this->type->getMethod($name));
    }

    /**
     * The constructor, its own or inherited; none when no class in its line declares one.
     *
     * @return Option<ReflectedMethod>
     */
    public function constructor(): Option
    {
        if (isset($this->constructor)) {
            return $this->constructor;
        }

        $constructor = $this->type->getConstructor();

        return $this->constructor = $constructor === null
            ? None::create()
            : new Some($this->method($constructor->getName()));
    }

    private function declaredAttributes(): DeclarationAttributes
    {
        return $this->declaredAttributes;
    }
}
