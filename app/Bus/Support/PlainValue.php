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
    public static function of(mixed $commandField): mixed
    {
        return match (true) {
            $commandField instanceof BackedEnum => $commandField->value,
            $commandField instanceof UnitEnum => $commandField->name,
            $commandField instanceof DateTimeInterface => $commandField->format(DateTimeInterface::ATOM),
            is_object($commandField) => array_map(self::of(...), get_object_vars($commandField)),
            is_array($commandField) => array_map(self::of(...), $commandField),
            default => $commandField,
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
