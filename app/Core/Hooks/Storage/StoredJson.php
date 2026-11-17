<?php

declare(strict_types=1);

namespace App\Core\Hooks\Storage;

use Closure;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use TypeError;

/**
 * Reads one stored JSON column into its typed value, and names the column when the value cannot be read.
 */
final class StoredJson
{
    /**
     * @template TValue
     *
     * @param  Closure(array<mixed>): TValue  $build
     * @return TValue
     */
    public static function read(string $column, mixed $value, Closure $build): mixed
    {
        try {
            return $build((array) json_decode((string) $value, true, flags: JSON_THROW_ON_ERROR));
        } catch (JsonException|CannotCreateData|TypeError $failure) {
            throw StoredValueInvalid::forColumn($column, $failure);
        }
    }
}
