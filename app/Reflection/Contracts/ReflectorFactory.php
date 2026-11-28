<?php

declare(strict_types=1);

namespace App\Reflection\Contracts;

use App\Reflection\Exceptions\ClassMissing;
use App\Support\Reflector;
use PhpOption\Option;

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
     * The reflection of a named type if its autoloader can load it.
     *
     * @return Option<Reflector<object>>
     */
    public function find(string $name): Option;

    /**
     * Whether the subject, a class name or an object, extends or implements this type as a strict subtype; false for
     * a name no autoloader can load.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true class-string<S>|S $subject
     */
    public function isSubclassOf(string|object $subject, string $type): bool;

    /**
     * Whether the subject, a class name or an object, is this type or a subtype of it; false for a name no autoloader
     * can load.
     *
     * @template S of object
     *
     * @param  class-string<S>  $type
     *
     * @phpstan-assert-if-true class-string<S>|S $subject
     */
    public function is(string|object $subject, string $type): bool;
}
