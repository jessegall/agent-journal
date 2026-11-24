<?php

declare(strict_types=1);

namespace App\Casts;

use App\Values\AskTypeKey;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads and writes an ask type column as its AskTypeKey, refusing a stored key that is not one.
 *
 * @implements CastsAttributes<AskTypeKey, AskTypeKey>
 */
final class AskTypeKeyCast implements CastsAttributes
{
    /**
     * @param  string  $value
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): AskTypeKey
    {
        return AskTypeKey::from($value);
    }

    /**
     * @param  AskTypeKey  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return $value->key;
    }
}
