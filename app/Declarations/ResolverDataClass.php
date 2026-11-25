<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Support\DeclaredType;
use App\Support\Reflector;
use Spatie\LaravelData\Data;

/**
 * Finds the concrete Data class a page or section reader declares as the return type of its read method, so the
 * generated browser types are checked against what the reader really returns.
 */
final class ResolverDataClass
{
    /**
     * @param  class-string  $resolver
     * @return class-string<Data>|null null when the read method declares no single, non-nullable, concrete Data class
     */
    public static function of(string $resolver): string|null
    {
        $type = Reflector::of($resolver)->method('read')->returnType()
            ->filter(fn (DeclaredType $declared) => $declared->isNamed() && ! $declared->isBuiltin())
            ->filter(fn (DeclaredType $declared) => ! $declared->allowsNull);

        if ($type->isEmpty()) {
            return null;
        }

        $name = $type->get()->name();

        if (! Reflector::factory()->isSubclassOf($name, Data::class) || Reflector::of($name)->isAbstract()) {
            return null;
        }

        return $name;
    }
}
