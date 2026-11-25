<?php

declare(strict_types=1);

namespace App\Casts;

use App\Values\LayoutShape;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * A layout's shape column as its LayoutShape: the page's JSON text, kept as given.
 *
 * @implements CastsAttributes<LayoutShape, LayoutShape>
 */
final class LayoutShapeCast implements CastsAttributes
{
    /**
     * @param  string  $value
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): LayoutShape
    {
        return new LayoutShape($value);
    }

    /**
     * @param  LayoutShape  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return $value->json;
    }
}
