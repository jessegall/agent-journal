<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelWrites\Models\Concerns;

/**
 * A model trait whose body deletes every row of the model using it.
 */
trait PrunesEveryRow
{
    public static function pruneEveryRow(): void
    {
        self::query()->delete();
    }
}
