<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Reflection\ReflectedType as ReflectedTypeContract;
use App\Contracts\Reflection\ReflectorFactory;
use App\Contracts\Reflection\TypeReflections;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The ReflectorFactory over the process's one catalogue, the same Reflectors ReflectedType::of() answers; to a domain it
 * answers only what TypeReflections lets it ask.
 */
final readonly class CatalogueReflectorFactory implements ReflectorFactory, TypeReflections
{
    public function of(string|object $type): ReflectedTypeContract
    {
        return $this->make($type);
    }

    public function make(string|object $type): ReflectedType
    {
        if (is_object($type)) {
            return $this->makeForInstance($type);
        }

        return $this->makeForClass($type);
    }

    public function isSubclassOf(string|object $subject, string $type): bool
    {
        return $this->found($subject)->filter(fn (ReflectedType $found) => $found->isSubclassOf($type))->isDefined();
    }

    public function is(string|object $subject, string $type): bool
    {
        return $this->found($subject)->filter(fn (ReflectedType $found) => $found->is($type))->isDefined();
    }

    /**
     * The ReflectedType of the subject's type; none for a name no autoloader can load.
     *
     * @return Option<ReflectedType<object>>
     */
    private function found(string|object $subject): Option
    {
        if (is_object($subject)) {
            return new Some(ReflectedType::of($subject));
        }

        return ReflectedType::find($subject);
    }

    /**
     * @template T of object
     *
     * @param  class-string<T>  $class
     * @return ReflectedType<T>
     */
    private function makeForClass(string $class): ReflectedType
    {
        return ReflectedType::of($class);
    }

    /**
     * @template T of object
     *
     * @param  T  $value
     * @return ReflectedType<T>
     */
    private function makeForInstance(object $value): ReflectedType
    {
        return ReflectedType::of($value);
    }
}
