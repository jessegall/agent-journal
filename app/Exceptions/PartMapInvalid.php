<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * The map of parts to wire types names a class or a type twice, or leaves a part out.
 */
final class PartMapInvalid extends LogicException
{
    public static function repeatedClass(string $class): self
    {
        return new self("{$class} is mapped twice.");
    }

    public static function repeatedType(string $type): self
    {
        return new self("Two parts are written as {$type}.");
    }

    public static function unmappedClass(string $class): self
    {
        return new self("{$class} has no wire mapping.");
    }

    public static function unmappedType(string $type): self
    {
        return new self("No part is written as {$type}.");
    }
}
