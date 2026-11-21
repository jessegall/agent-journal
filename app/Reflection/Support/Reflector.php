<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Exceptions\ClassMissing;
use App\Reflection\Exceptions\MethodMissing;
use App\Reflection\Exceptions\PropertyMissing;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use ReflectionClass;
use ReflectionEnum;
use ReflectionEnumUnitCase;
use ReflectionMethod;
use ReflectionProperty;

/**
 * What PHP declares about one class, interface, trait or enum, read once and kept for the life of the process.
 *
 * @template-covariant T of object
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
     * @var Option<string>
     */
    private Option $fileName;

    /**
     * @var list<ReflectedEnumCase>
     */
    private array $cases;

    /**
     * @var Option<string>
     */
    private Option $backingType;

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
     * Whether any autoloader can load a class, interface, trait or enum of this name; nothing is kept for a name that
     * does not load.
     *
     * @phpstan-assert-if-true class-string $name
     */
    public static function exists(string $name): bool
    {
        return class_exists($name) || interface_exists($name) || trait_exists($name) || enum_exists($name);
    }

    /**
     * The Reflector of the type a name names; none when no autoloader can load it, and nothing is kept for such a
     * name.
     *
     * @return Option<self<object>>
     */
    public static function find(string $name): Option
    {
        return self::exists($name) ? new Some(self::of($name)) : None::create();
    }

    /**
     * Whether the name names a loadable type that extends or implements this type, as a strict subtype; false for a
     * name no autoloader can load.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true class-string<S> $name
     */
    public static function isNameSubclassOf(string $name, string $type): bool
    {
        return self::find($name)->filter(fn (self $found) => $found->isSubclassOf($type))->isDefined();
    }

    /**
     * Whether the name names a loadable type that is this type or a subtype of it; false for a name no autoloader can
     * load.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true class-string<S> $name
     */
    public static function isNameOf(string $name, string $type): bool
    {
        return self::find($name)->filter(fn (self $found) => $found->is($type))->isDefined();
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

    /**
     * The type's own docblock; none when it has none.
     *
     * @return Option<string>
     */
    public function docComment(): Option
    {
        $comment = $this->type->getDocComment();

        return $comment === false ? None::create() : new Some($comment);
    }

    /**
     * The line the declaration starts on in its file; 0 for a type PHP or an extension declares.
     */
    public function startLine(): int
    {
        return (int) $this->type->getStartLine();
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
        if (isset($this->fileName)) {
            return $this->fileName;
        }

        $file = $this->type->getFileName();

        return $this->fileName = $file === false ? None::create() : new Some($file);
    }

    /**
     * The same questions turned around: $type->not()->is(X) answers whether it is no X.
     *
     * @return ReflectorNegation<T>
     */
    public function not(): ReflectorNegation
    {
        return new ReflectorNegation($this);
    }

    /**
     * Whether it is a class: not an interface, a trait or an enum.
     */
    public function isClass(): bool
    {
        return ! $this->isInterface() && ! $this->isTrait() && ! $this->isEnum();
    }

    /**
     * Whether it is this type or a subtype of it: the same class, a class that extends it, or one that implements it.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true self<S> $this
     */
    public function is(string $type): bool
    {
        return is_a($this->name(), $type, true);
    }

    /**
     * Whether the value is an object of this type or of a subtype of it.
     *
     * @phpstan-assert-if-true T $value
     */
    public function isInstance(mixed $value): bool
    {
        return $value instanceof $this->type->name;
    }

    /**
     * The value as an object of this type; none when it is no such object.
     *
     * @return Option<T>
     */
    public function asInstance(mixed $value): Option
    {
        return $this->isInstance($value) ? new Some($value) : None::create();
    }

    /**
     * Whether it extends or implements this type, as a strict subtype: the type itself is not its own subclass.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true self<S> $this
     */
    public function isSubclassOf(string $type): bool
    {
        return is_subclass_of($this->name(), $type);
    }

    /**
     * Whether it implements this interface, itself or through a parent or another interface.
     *
     * @template S of object
     *
     * @param  class-string<S>  $interface
     *
     * @phpstan-assert-if-true self<S> $this
     */
    public function implements(string $interface): bool
    {
        return interface_exists($interface) && $this->type->implementsInterface($interface);
    }

    /**
     * Whether it, a class it extends or a trait any of them uses uses this trait.
     *
     * @param  class-string  $trait
     */
    public function uses(string $trait): bool
    {
        return array_any(
            $this->lineage(),
            fn (self $class) => array_any(
                $class->traits(),
                fn (self $used) => strcasecmp($used->name(), $trait) === 0 || $used->uses($trait),
            ),
        );
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

    public function isTrait(): bool
    {
        return $this->type->isTrait();
    }

    /**
     * The scalar type a backed enum's cases carry, int or string; none for a pure enum or a class.
     *
     * @return Option<string>
     */
    public function backingType(): Option
    {
        if (isset($this->backingType)) {
            return $this->backingType;
        }

        $name = $this->name();
        $backing = enum_exists($name) ? new ReflectionEnum($name)->getBackingType() : null;

        return $this->backingType = $backing === null ? None::create() : new Some((string) $backing);
    }

    /**
     * An enum's cases in declaration order, each with its attributes; none for a class.
     *
     * @return list<ReflectedEnumCase>
     */
    public function cases(): array
    {
        $name = $this->name();

        return $this->cases ??= enum_exists($name)
            ? array_values(array_map(
                fn (ReflectionEnumUnitCase $case) => new ReflectedEnumCase($case),
                new ReflectionEnum($name)->getCases(),
            ))
            : [];
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
     * A new object of the class built through its constructor with these arguments, on every call and never kept.
     *
     * @return T
     */
    public function newInstance(mixed ...$arguments): object
    {
        return $this->type->newInstance(...$arguments);
    }

    /**
     * A new lazy ghost of the class that runs the initializer on first use, built on every call; neither the ghost
     * nor the initializer is kept.
     *
     * @param  callable(T): void  $initializer
     * @return T
     */
    public function newLazyGhost(callable $initializer): object
    {
        return $this->type->newLazyGhost($initializer);
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

    /**
     * The property of this name, its own or inherited, read from the kept list.
     *
     * @throws PropertyMissing
     */
    public function property(string $name): ReflectedProperty
    {
        $property = array_find($this->properties(), fn (ReflectedProperty $candidate) => $candidate->name() === $name);

        if ($property === null) {
            throw PropertyMissing::on($this->name(), $name);
        }

        return $property;
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
     * Every interface it implements, itself or through a parent or another interface.
     *
     * @return list<Reflector<object>>
     */
    public function interfaces(): array
    {
        return array_map(fn (string $interface) => self::of($interface), $this->type->getInterfaceNames());
    }

    /**
     * The traits the class itself uses, in the order it names them; not those of its parents or of other traits.
     *
     * @return list<Reflector<object>>
     */
    public function traits(): array
    {
        return array_map(fn (string $trait) => self::of($trait), $this->type->getTraitNames());
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
