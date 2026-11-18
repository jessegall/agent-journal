<?php

declare(strict_types=1);

namespace Domain\Documents\Models\Concerns;

/**
 * For a Documents model that stores a Markdown body: the body's stored length in bytes, computed by the database, so
 * a body too large to show is refused before it is ever loaded.
 */
trait MeasuresBody
{
    public static function bodyBytesOf(string $id): int
    {
        return (int) self::query()->whereKey($id)->selectRaw('octet_length(body) as body_bytes')->value('body_bytes');
    }
}
