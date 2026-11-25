<?php

declare(strict_types=1);

namespace Tests\Fixtures\ColumnJson;

use App\Attributes\DecodesAnyJson;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * A cast that reads a column's JSON by hand, which is refused, and one that keeps JSON of no fixed shape, which passes.
 *
 * @implements CastsAttributes<mixed, mixed>
 */
final class ReceiptLinesCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        return json_decode((string) $value, true, flags: JSON_THROW_ON_ERROR);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    #[DecodesAnyJson]
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return json_encode($value, JSON_THROW_ON_ERROR);
    }
}
