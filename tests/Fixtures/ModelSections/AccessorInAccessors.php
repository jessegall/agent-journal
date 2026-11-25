<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * A model whose accessor sits in Accessors, after its Getters.
 */
final class AccessorInAccessors extends Model
{
    // ----------[ Getters ]----------

    public function isDone(): bool
    {
        return true;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<int, never>
     */
    protected function progress(): Attribute
    {
        return Attribute::get(fn (): int => 3);
    }
}
