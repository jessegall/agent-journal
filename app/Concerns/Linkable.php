<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Models\Link;
use App\Support\LinkAccess;
use Illuminate\Database\Eloquent\Model;

/**
 * Lets a model link to any other model. The other model is always one the caller already read through its own
 * scoped query, and linked models are only found among a query the caller is allowed to read.
 *
 * @mixin Model
 */
trait Linkable
{
    public function isLinkedTo(Model $other): bool
    {
        return Link::query()->between($this, $other)->exists();
    }

    public function links(): LinkAccess
    {
        return new LinkAccess($this);
    }
}
