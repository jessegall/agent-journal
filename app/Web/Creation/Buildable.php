<?php

declare(strict_types=1);

namespace App\Web\Creation;

/** @template TFields of object */
trait Buildable
{
    /** @return TFields */
    final public static function build(): object
    {
        /** @var class-string<TFields> $fields */
        $fields = static::FIELDS;

        return new $fields();
    }
}
