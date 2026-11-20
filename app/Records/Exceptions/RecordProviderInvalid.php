<?php

declare(strict_types=1);

namespace App\Records\Exceptions;

use LogicException;

/**
 * A domain registered a record provider twice for one alias, or a class that is no record provider.
 */
final class RecordProviderInvalid extends LogicException
{
    public static function repeated(string $type): self
    {
        return new self("A record provider is already registered for {$type}.");
    }

    public static function notAProvider(string $type, string $class): self
    {
        return new self("{$class}, registered for {$type}, is no record provider.");
    }
}
