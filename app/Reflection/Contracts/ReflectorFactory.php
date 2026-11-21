<?php

declare(strict_types=1);

namespace App\Reflection\Contracts;

use App\Reflection\Exceptions\ClassMissing;
use App\Reflection\Support\Reflector;

/**
 * Hands a class the process's one Reflector of a type, so it takes the factory in its constructor instead of calling
 * Reflector::of itself.
 */
interface ReflectorFactory
{
    /**
     * The Reflector of a class named, or of an object's own class; an object given is not kept.
     *
     * @template T of object
     *
     * @param  class-string<T>|T  $type
     * @return Reflector<T>
     *
     * @throws ClassMissing
     */
    public function make(string|object $type): Reflector;

    /**
     * Whether any autoloader can load a class, interface, trait or enum of this name.
     *
     * @phpstan-assert-if-true class-string $name
     */
    public function exists(string $name): bool;

    /**
     * Whether the name names a loadable type that extends or implements this type, as a strict subtype.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true class-string<S> $name
     */
    public function isNameSubclassOf(string $name, string $type): bool;

    /**
     * Whether the name names a loadable type that is this type or a subtype of it.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true class-string<S> $name
     */
    public function isNameOf(string $name, string $type): bool;
}
