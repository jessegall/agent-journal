<?php

declare(strict_types=1);

namespace App\Core\Ui\Declarations;

use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;
use Spatie\LaravelData\Data;

/**
 * Finds the concrete Data class a page or section reader declares as the return type of its read method, so the
 * generated browser types are checked against what the reader really returns.
 */
final class ReaderDataClass
{
    /**
     * @return class-string<Data>|null null when the read method declares no single, non-nullable, concrete Data class
     */
    public static function of(string $reader): string|null
    {
        $type = new ReflectionMethod($reader, 'read')->getReturnType();

        if (! $type instanceof ReflectionNamedType || $type->isBuiltin() || $type->allowsNull()) {
            return null;
        }

        $name = $type->getName();

        if (! is_subclass_of($name, Data::class) || new ReflectionClass($name)->isAbstract()) {
            return null;
        }

        return $name;
    }
}
