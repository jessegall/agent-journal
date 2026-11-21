<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Exceptions\AttributeMissing;
use App\Reflection\Exceptions\ClassMissing;
use ReflectionClass;

/**
 * What PHP declares about one class, interface, trait or enum, read once and kept for the life of the process.
 *
 * @template T of object
 */
final class Reflector
{
    /**
     * @var ReflectionClass<T>
     */
    private readonly ReflectionClass $type;

    private readonly DeclarationAttributes $declaredAttributes;

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
        return ReflectionCatalogue::current()->reflector($target, fn (string $name) => new self($name));
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
     * The type's own attributes of exactly this class, in declaration order.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return Attributes<A>
     */
    public function attributes(string $type): Attributes
    {
        return $this->declaredAttributes->attributes($type);
    }

    /**
     * The type's own attributes of this class or of any class that extends or implements it.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return Attributes<A>
     */
    public function attributesImplementing(string $type): Attributes
    {
        return $this->declaredAttributes->attributesImplementing($type);
    }

    /**
     * The type's first own attribute of exactly this class, built.
     *
     * @template A of object
     *
     * @param  class-string<A>  $type
     * @return A
     *
     * @throws AttributeMissing
     */
    public function attribute(string $type): object
    {
        return $this->declaredAttributes->attribute($type);
    }

    /**
     * Whether the type carries an attribute of exactly this class, without building any.
     *
     * @param  class-string  $type
     */
    public function hasAttribute(string $type): bool
    {
        return $this->declaredAttributes->hasAttribute($type);
    }
}
