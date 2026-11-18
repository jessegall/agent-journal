<?php

declare(strict_types=1);

namespace App\Processes\Casts;

use App\Processes\Contracts\StoredValue;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * A list of typed values in a JSON column, such as a proposal revision's examples: each written with toArray and
 * read with fromArray of the value class the cast names.
 *
 * @template TValue of StoredValue
 *
 * @implements CastsAttributes<list<TValue>, list<TValue>>
 */
final class StoredValuesCast implements CastsAttributes
{
    /**
     * @param  class-string<TValue>  $valueClass
     */
    public function __construct(private readonly string $valueClass) {}

    /**
     * @param  array<string, mixed>  $attributes
     * @return list<TValue>
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): array
    {
        $rows = json_decode((string) $value, true, flags: JSON_THROW_ON_ERROR);

        return array_values(array_map($this->valueClass::fromArray(...), $rows));
    }

    /**
     * @param  list<TValue>  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return json_encode(array_map(fn (StoredValue $item): array => $item->toArray(), $value), JSON_THROW_ON_ERROR);
    }
}
