<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * A model whose accessor sits under Answers, and whose Accessors section holds a method that is no accessor.
 */
final class AccessorOutsideAccessors extends Model
{
    // ----------[ Answers ]----------

    protected function progress(): Attribute
    {
        return Attribute::get(fn (): int => 3);
    }

    // ----------[ Accessors ]----------

    public function isDone(): bool
    {
        return true;
    }
}
