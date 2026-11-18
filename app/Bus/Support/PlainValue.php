<?php

declare(strict_types=1);

namespace App\Bus\Support;

use BackedEnum;
use DateTimeInterface;
use UnitEnum;

/**
 * A command or a result as plain JSON values: an enum as its value, a time as ISO 8601, an object as its public
 * fields, recursively. Two equal commands give equal plain values.
 */
final class PlainValue
{
    public static function of(mixed $value): mixed
    {
        return match (true) {
            $value instanceof BackedEnum => $value->value,
            $value instanceof UnitEnum => $value->name,
            $value instanceof DateTimeInterface => $value->format(DateTimeInterface::ATOM),
            is_object($value) => array_map(self::of(...), get_object_vars($value)),
            is_array($value) => array_map(self::of(...), $value),
            default => $value,
        };
    }

    /**
     * The SHA-256 of the command's class and its plain fields: the same write gives the same fingerprint.
     */
    public static function fingerprintOf(object $command): string
    {
        return hash('sha256', $command::class."\n".json_encode(self::of($command), JSON_THROW_ON_ERROR));
    }
}
