<?php

declare(strict_types=1);

namespace App\Reflection\Support;

use App\Reflection\Contracts\ReflectorFactory;
use PhpOption\Option;
use PhpOption\Some;

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

    public function isSubclassOf(string|object $subject, string $type): bool
    {
        return $this->found($subject)->filter(fn (Reflector $found) => $found->isSubclassOf($type))->isDefined();
    }

    public function is(string|object $subject, string $type): bool
    {
        return $this->found($subject)->filter(fn (Reflector $found) => $found->is($type))->isDefined();
    }

    /**
     * The Reflector of the subject's type; none for a name no autoloader can load.
     *
     * @return Option<Reflector<object>>
     */
    private function found(string|object $subject): Option
    {
        return is_object($subject) ? new Some(Reflector::of($subject)) : Reflector::find($subject);
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
