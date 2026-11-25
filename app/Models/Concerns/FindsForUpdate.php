<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Exceptions\ModelMissing;

/**
 * Finds one row by its key, locked for a change, within what the global scopes let the current actor see; a row that
 * is missing or hidden throws ModelMissing, which the bus answers as an unavailable record.
 */
trait FindsForUpdate
{
    /**
     * @throws ModelMissing
     */
    public static function ownForUpdate(string $id): static
    {
        return static::query()->whereKey($id)->lockForUpdate()->firstOr(
            ModelMissing::throwing()->for(static::class, $id),
        );
    }
}
