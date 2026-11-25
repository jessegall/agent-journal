<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Model;

/**
 * A model with two constructors, the plain create that makes the row and one named for what it does, and a builder
 * only its second constructor calls.
 */
final class ConstructorsNamedOtherwise extends Model
{
    // ----------[ Constructors ]----------

    public static function create(): self
    {
        return self::query()->create([]);
    }

    public static function open(): self
    {
        $row = self::draft();
        $row->save();

        return $row;
    }

    // ----------[ Internals ]----------

    private static function draft(): self
    {
        return new self();
    }
}
