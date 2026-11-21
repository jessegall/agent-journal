<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

/**
 * Reads and writes the frames column as a versioned FrameRecords value, and refuses a stored value it cannot read.
 *
 * @implements CastsAttributes<FrameRecords, FrameRecords>
 */
final class FrameRecordsCast implements CastsAttributes
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): FrameRecords
    {
        return StoredJson::read($key, $value, fn (string $stored) => StoredFrames::from($stored)->toRecords());
    }

    /**
     * @param  FrameRecords  $value
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return StoredFrames::fromFrameRecords($value)->toJson();
    }
}
