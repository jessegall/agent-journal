<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Exceptions\ClassMissing;
use App\Support\ReflectedType;

/**
 * Reflects the class that uses it, or the class or object it is given, through the process's one ReflectedType of that
 * type. It keeps no state, so readonly classes and enums use it too.
 */
trait Reflects
{
    /**
     * @template U of object
     *
     * @param  class-string<U>|U|null  $target
     * @return ($target is null ? ReflectedType<static> : ReflectedType<U>)
     *
     * @throws ClassMissing
     */
    protected static function reflect(string|object|null $target = null): ReflectedType
    {
        if ($target === null) {
            return ReflectedType::of(static::class);
        }

        return ReflectedType::of($target);
    }
}
