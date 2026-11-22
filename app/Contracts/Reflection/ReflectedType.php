<?php

declare(strict_types=1);

namespace App\Contracts\Reflection;

/**
 * What a domain may ask of one reflected class: whether it declares a method, calling that method on an instance,
 * and an instance whose constructor runs only on its first use.
 *
 * @template-covariant T of object
 */
interface ReflectedType
{
    public function hasMethod(string $name): bool;

    /**
     * Calls the named method on the target and answers what it returns.
     */
    public function invokeMethod(string $name, object $target, mixed ...$arguments): mixed;

    /**
     * An instance whose initializer runs on its first use, so reading it builds nothing yet.
     *
     * @param  callable(T): void  $initializer
     * @return T
     */
    public function newLazyGhost(callable $initializer): object;
}
