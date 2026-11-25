<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Model;

/**
 * A model whose Queries break the naming of what they hand back, beside a well named one.
 */
final class QueriesNamedOtherwise extends Model
{
    // ----------[ Queries ]----------

    public static function newest(): self|null
    {
        return self::query()->latest()->first();
    }

    public static function resolveOldest(): self
    {
        return self::query()->oldest()->firstOrFail();
    }

    public static function findLabel(): string
    {
        return (string) self::query()->value('label');
    }

    public static function countOpen(): string
    {
        return (string) self::query()->count();
    }

    public static function findOrMake(): self
    {
        return self::query()->first() ?? new self();
    }

    public static function findFirst(): self|null
    {
        return self::query()->first();
    }
}
