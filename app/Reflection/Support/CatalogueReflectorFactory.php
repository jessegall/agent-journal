<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Contracts\ReflectorFactory;

/**
 * The ReflectorFactory over the process's one catalogue, the same Reflectors Reflector::of() answers.
 */
final readonly class CatalogueReflectorFactory implements ReflectorFactory
{
    public function make(string|object $type): Reflector
    {
        return is_object($type) ? $this->makeForInstance($type) : $this->makeForClass($type);
    }

    public function exists(string $name): bool
    {
        return Reflector::exists($name);
    }

    public function isNameSubclassOf(string $name, string $type): bool
    {
        return Reflector::isNameSubclassOf($name, $type);
    }

    public function isNameOf(string $name, string $type): bool
    {
        return Reflector::isNameOf($name, $type);
    }

    /**
     * @template T of object
     *
     * @param  class-string<T>  $class
     * @return Reflector<T>
     */
    private function makeForClass(string $class): Reflector
    {
        return Reflector::of($class);
    }

    /**
     * @template T of object
     *
     * @param  T  $value
     * @return Reflector<T>
     */
    private function makeForInstance(object $value): Reflector
    {
        return Reflector::of($value);
    }
}
