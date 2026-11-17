<?php

declare(strict_types=1);

namespace App\Domain\Web\Data\Concerns;

use Spatie\LaravelData\Optional;

/**
 * The null-to-Optional map in one place: a null payload becomes an absent value left off the wire, anything else is
 * built through ::from.
 */
trait OptionalOrMissing
{
    public static function optionalOrMissing(mixed $payload): static|Optional
    {
        return $payload === null ? Optional::create() : static::from($payload);
    }
}
