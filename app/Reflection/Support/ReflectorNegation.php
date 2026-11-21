<?php

declare(strict_types=1);

namespace App\Reflection\Support;

/**
 * A Reflector's yes-or-no questions turned around, so a caller reads $type->not()->is(X) instead of a bang.
 *
 * @template T of object
 */
final readonly class ReflectorNegation
{
    /**
     * @param  Reflector<T>  $type
     */
    public function __construct(private Reflector $type) {}

    public function isClass(): bool
    {
        return ! $this->type->isClass();
    }

    public function isInterface(): bool
    {
        return ! $this->type->isInterface();
    }

    public function isEnum(): bool
    {
        return ! $this->type->isEnum();
    }

    public function isTrait(): bool
    {
        return ! $this->type->isTrait();
    }

    public function isAbstract(): bool
    {
        return ! $this->type->isAbstract();
    }

    public function isFinal(): bool
    {
        return ! $this->type->isFinal();
    }

    public function isReadOnly(): bool
    {
        return ! $this->type->isReadOnly();
    }

    public function isInstantiable(): bool
    {
        return ! $this->type->isInstantiable();
    }

    /**
     * @param  class-string  $type
     */
    public function is(string $type): bool
    {
        return ! $this->type->is($type);
    }

    /**
     * @param  class-string  $type
     */
    public function isSubclassOf(string $type): bool
    {
        return ! $this->type->isSubclassOf($type);
    }

    /**
     * @param  class-string  $interface
     */
    public function implements(string $interface): bool
    {
        return ! $this->type->implements($interface);
    }

    /**
     * @param  class-string  $trait
     */
    public function uses(string $trait): bool
    {
        return ! $this->type->uses($trait);
    }

    public function isInstance(mixed $value): bool
    {
        return ! $this->type->isInstance($value);
    }

    public function hasMethod(string $name): bool
    {
        return ! $this->type->hasMethod($name);
    }

    public function hasProperty(string $name): bool
    {
        return ! $this->type->hasProperty($name);
    }

    /**
     * @param  class-string  $type
     */
    public function hasAttribute(string $type): bool
    {
        return ! $this->type->hasAttribute($type);
    }
}
