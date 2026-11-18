<?php

declare(strict_types=1);

namespace App\Reads\Support;

use Illuminate\Events\NullDispatcher;

/**
 * Counts a model hydrated from the database while its events are switched off, which the retrieved listener cannot
 * see; with events on, that listener counts it.
 */
trait CountsLoads
{
    /**
     * @param  array<string, mixed>  $attributes
     * @param  string|null  $connection
     */
    public function newFromBuilder($attributes = [], $connection = null): static
    {
        $model = parent::newFromBuilder($attributes, $connection);

        $eventsAreOff = static::getEventDispatcher() === null || static::getEventDispatcher() instanceof NullDispatcher;

        if ($eventsAreOff) {
            ScopedReadMeter::ofCurrentScope()->recordModel(static::class);
        }

        return $model;
    }
}
