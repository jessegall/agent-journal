<?php

declare(strict_types=1);

namespace App\Reflection;

use App\Reflection\Contracts\Reflector as ReflectorContract;
use App\Reflection\Contracts\ReflectorFactory;
use App\Reflection\Contracts\TypeReflections;
use App\Support\Reflector;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The ReflectorFactory over the process's one catalogue, the same Reflectors Reflector::of() answers; to a domain it
 * answers only what TypeReflections lets it ask.
 */
final readonly class CatalogueReflectorFactory implements ReflectorFactory, TypeReflections
{
    public function of(string|object $type): ReflectorContract
    {
        return $this->make($type);
    }

    public function make(string|object $type): Reflector
    {
        if (is_object($type)) {
            return $this->makeForInstance($type);
        }

        return $this->makeForClass($type);
    }

    public function isSubclassOf(string|object $subject, string $type): bool
    {
        return $this->found($subject)->filter(fn (Reflector $found) => $found->isSubclassOf($type))->isDefined();
    }

    public function find(string $name): Option
    {
        return Reflector::find($name);
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
        if (is_object($subject)) {
            return new Some(Reflector::of($subject));
        }

        return $this->find($subject);
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
