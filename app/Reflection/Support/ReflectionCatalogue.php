<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Exceptions\ClassMissing;
use Closure;
use ReflectionClass;

/**
 * The one Reflector per loaded type of this process, found by any spelling PHP accepts for that type: its name, an
 * alias, a leading backslash or other letter case. It keeps no object it was given and remembers no missing name.
 */
final class ReflectionCatalogue
{
    private static self|null $current = null;

    /**
     * Each Reflector by its type's canonical name.
     *
     * @var array<class-string, Reflector<object>>
     */
    private array $reflectors = [];

    /**
     * The canonical name of each loaded type by a lowercase spelling it was asked by: its own name or an alias.
     *
     * @var array<string, class-string>
     */
    private array $canonicalNames = [];

    public static function current(): self
    {
        return self::$current ??= new self();
    }

    /**
     * @template U of object
     *
     * @param  class-string<U>|U  $target
     * @param  Closure(class-string<U>): Reflector<U>  $build
     * @return Reflector<U>
     *
     * @throws ClassMissing
     */
    public function reflector(string|object $target, Closure $build): Reflector
    {
        $name = $this->canonicalNameOf(is_object($target) ? $target::class : $target);

        $reflector = $this->reflectors[$name] ??= $build($name);

        /**
         * A reflector is stored only under the canonical name it was built for.
         *
         * @var Reflector<U> $reflector
         */
        return $reflector;
    }

    /**
     * @template U of object
     *
     * @param  class-string<U>  $name
     * @return class-string<U>
     *
     * @throws ClassMissing
     */
    private function canonicalNameOf(string $name): string
    {
        $spelling = strtolower(ltrim($name, '\\'));

        if (isset($this->canonicalNames[$spelling])) {
            /**
             * A spelling is stored only for the type it loaded.
             *
             * @var class-string<U> $canonical
             */
            $canonical = $this->canonicalNames[$spelling];

            return $canonical;
        }

        if (! self::loads($name)) {
            throw ClassMissing::for($name);
        }

        return $this->canonicalNames[$spelling] = new ReflectionClass($name)->getName();
    }

    private static function loads(string $name): bool
    {
        return class_exists($name) || interface_exists($name) || trait_exists($name) || enum_exists($name);
    }
}
