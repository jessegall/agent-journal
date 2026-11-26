<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Storage;

use App\Exceptions\StoredValueInvalid;
use Closure;
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
     * @param  Closure(string): TValue  $build  hands the JSON text to a Data class's from(), which decodes it
     * @return TValue
     */
    public static function read(string $column, mixed $json, Closure $build): mixed
    {
        try {
            return $build((string) $json);
        } catch (CannotCreateData|TypeError $failure) {
            throw StoredValueInvalid::forColumn($column, $failure);
        }
    }
}
