<?php

declare(strict_types=1);

namespace App\Contracts\Reflection;

use App\Exceptions\ClassMissing;

/**
 * Hands a domain what it may ask of a class, read once for the process; Core's own code takes the full
 * ReflectorFactory instead.
 */
interface TypeReflections
{
    /**
     * What the class named, or an object's own class, declares.
     *
     * @template T of object
     *
     * @param  class-string<T>|T  $type
     * @return ReflectedType<T>
     *
     * @throws ClassMissing
     */
    public function of(string|object $type): ReflectedType;
}
