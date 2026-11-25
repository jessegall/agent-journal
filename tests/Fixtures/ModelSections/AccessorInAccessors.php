<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

/**
 * A model whose predicate, transformer and accessor each sit in their own section.
 */
final class AccessorInAccessors extends Model
{
    // ----------[ Predicates ]----------

    public function isDone(): bool
    {
        return true;
    }

    // ----------[ Transformers ]----------

    /**
     * @return list<int>
     */
    public function steps(): array
    {
        return [1];
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
