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
}
