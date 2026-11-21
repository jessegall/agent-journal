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
     * The one Reflector of the type a spelling names, built by $build the first time the type is asked for.
     *
     * @param  string  $name  any spelling PHP accepts for the type
     * @param  Closure(class-string): Reflector<object>  $build
     * @return Reflector<object> the Reflector of exactly the type $name names
     *
     * @throws ClassMissing
     */
    public function reflector(string $name, Closure $build): Reflector
    {
        $canonical = $this->canonicalNameOf($name);

        return $this->reflectors[$canonical] ??= $build($canonical);
    }

    /**
     * @return class-string
     *
     * @throws ClassMissing
     */
    private function canonicalNameOf(string $name): string
    {
        $spelling = strtolower(ltrim($name, '\\'));

        if (isset($this->canonicalNames[$spelling])) {
            return $this->canonicalNames[$spelling];
        }

        if (! self::loads($name)) {
            throw ClassMissing::for($name);
        }

        return $this->canonicalNames[$spelling] = new ReflectionClass($name)->getName();
    }

    /**
     * @phpstan-assert-if-true class-string $name
     */
    private static function loads(string $name): bool
    {
        return class_exists($name) || interface_exists($name) || trait_exists($name) || enum_exists($name);
    }
}
