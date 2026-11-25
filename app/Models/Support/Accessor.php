<?php

declare(strict_types=1);

namespace App\Models\Support;

use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * The one way a model writes an accessor: Laravel's Attribute with object caching off, so an accessor that gives an
 * object builds it again on each read and a read after a change of the row sees the change (user message 22174).
 * The accessor method still declares : Attribute, which is how Laravel knows it.
 *
 * @template TGet
 * @template TSet
 *
 * @extends Attribute<TGet, TSet>
 */
final class Accessor extends Attribute
{
    /**
     * Whether an object the accessor gives is kept for the next read; never, so each read builds it again.
     *
     * @var bool
     */
    public $withObjectCaching = false;
}
