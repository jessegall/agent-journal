<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Support\ReadMeter;
use Illuminate\Database\Eloquent\Model;

/**
 * Counts a pivot built from an existing row of a many-to-many read, which fires no retrieved event.
 */
trait CountsPivotLoads
{
    /**
     * @param  array<string, mixed>  $attributes
     * @param  string  $table
     * @param  bool  $exists
     */
    public static function fromRawAttributes(Model $parent, $attributes, $table, $exists = false): static
    {
        $pivot = parent::fromRawAttributes($parent, $attributes, $table, $exists);

        if ($exists) {
            ReadMeter::ofCurrentScope()->recordModel(static::class);
        }

        return $pivot;
    }
}
