<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Model;

/**
 * A model whose constructor works out the next number with a query of its own, where a resolve method of Queries
 * should read it.
 */
final class ConstructorReadsItself extends Model
{
    // ----------[ Constructors ]----------

    public static function create(): self
    {
        $row = new self();
        $row->number = (int) self::query()->max('number') + 1;
        $row->save();

        return $row;
    }
}
