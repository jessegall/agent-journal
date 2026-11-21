<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads and writes the answer column as a versioned RecordedAnswer value, and refuses a stored value it cannot read.
 *
 * @implements CastsAttributes<RecordedAnswer, RecordedAnswer>
 */
final class RecordedAnswerCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): RecordedAnswer
    {
        return StoredJson::read(
            $key,
            $value,
            fn (string $stored) => RecordedAnswer::from($stored)->assertCurrentVersion(),
        );
    }

    /**
     * @param  RecordedAnswer  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return $value->toJson();
    }
}
