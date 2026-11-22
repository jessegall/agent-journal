<?php

declare(strict_types=1);

namespace App\Casts;

use App\Contracts\StoredValue;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * One typed value in a JSON column, such as a proposal revision's CommandRule: written with toArray, read with
 * fromJson of the value class the cast names.
 *
 * @template TValue of StoredValue
 *
 * @implements CastsAttributes<TValue, TValue>
 */
final class StoredValueCast implements CastsAttributes
{
    /**
     * @param  class-string<TValue>  $valueClass
     */
    public function __construct(private readonly string $valueClass) {}

    /**
     * @param  array<string, mixed>  $attributes
     * @return TValue
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): StoredValue
    {
        return $this->valueClass::fromJson((string) $value);
    }

    /**
     * @param  TValue  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return json_encode($value->toArray(), JSON_THROW_ON_ERROR);
    }
}
