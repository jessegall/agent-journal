<?php

declare(strict_types=1);

namespace App\Casts;

use App\Contracts\Settings\StoredValue;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * One typed value in a JSON column that may be empty: none while the column is null, otherwise read and written as
 * StoredValueCast reads and writes it.
 *
 * @template TValue of StoredValue
 *
 * @implements CastsAttributes<TValue|null, TValue|null>
 */
final class OptionalStoredValueCast implements CastsAttributes
{
    /**
     * @var StoredValueCast<TValue>
     */
    private readonly StoredValueCast $valueCast;

    /**
     * @param  class-string<TValue>  $valueClass
     */
    public function __construct(string $valueClass)
    {
        $this->valueCast = new StoredValueCast($valueClass);
    }

    /**
     * @param  array<string, mixed>  $attributes
     * @return TValue|null
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): StoredValue|null
    {
        if ($value === null) {
            return null;
        }

        return $this->valueCast->get($model, $key, $value, $attributes);
    }

    /**
     * @param  TValue|null  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string|null
    {
        if ($value === null) {
            return null;
        }

        return $this->valueCast->set($model, $key, $value, $attributes);
    }
}
