<?php

declare(strict_types=1);

namespace App\Accounts\Data\Support;

use Spatie\LaravelData\Optional;

/**
 * Maps a null payload to an absent `Optional`, omitted from the wire, and anything else through `::from`: the
 * counterpart of Spatie's `optional()`, which keeps null. Use it on a `Data` class and build with
 * `optionalOrMissing($payload)`.
 */
trait OptionalOrMissing
{
    public static function optionalOrMissing(mixed $dataSource): static|Optional
    {
        if ($dataSource === null) {
            return Optional::create();
        }

        return static::from($dataSource);
    }
}
