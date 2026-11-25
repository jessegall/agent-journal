<?php

declare(strict_types=1);

namespace App\Contracts\Reflection;

use App\Exceptions\ClassMissing;
use App\Support\ReflectedType;

/**
 * Hands a class the process's one ReflectedType of a type, so it takes the factory in its constructor instead of calling
 * ReflectedType::of itself.
 */
interface ReflectorFactory
{
    /**
     * The ReflectedType of a class named, or of an object's own class; an object given is not kept.
     *
     * @template T of object
     *
     * @param  class-string<T>|T  $type
     * @return ReflectedType<T>
     *
     * @throws ClassMissing
     */
    public function make(string|object $type): ReflectedType;

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
