<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Storage;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads and writes the steps column as a versioned RecordedSteps value, and refuses a stored value it cannot read.
 *
 * @implements CastsAttributes<RecordedSteps, RecordedSteps>
 */
final class RecordedStepsCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): RecordedSteps
    {
        return StoredJson::read($key, $value, fn (array $stored) => RecordedSteps::from($stored)->checkVersion());
    }

    /**
     * @param  RecordedSteps  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return $value->toJson();
    }
}
