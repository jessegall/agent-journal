<?php

declare(strict_types=1);

namespace App\Bus\Concerns;

use App\Reflection\Exceptions\ClassMissing;
use App\Support\Reflector;

/**
 * Reflects the class that uses it, or the class or object it is given, through the process's one Reflector of that
 * type. It keeps no state, so readonly classes and enums use it too.
 */
trait Reflects
{
    /**
     * @template U of object
     *
     * @param  class-string<U>|U|null  $target
     * @return ($target is null ? Reflector<static> : Reflector<U>)
     *
     * @throws ClassMissing
     */
    protected static function reflect(string|object|null $target = null): Reflector
    {
        if ($target === null) {
            return Reflector::of(static::class);
        }

        return Reflector::of($target);
    }
}
