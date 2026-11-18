<?php

declare(strict_types=1);

namespace App\Actors\Support\Concerns;

/**
 * An identity made of a type and an id: two are the same when both match.
 */
trait ComparesTypeAndId
{
    public function isSameAs(self $other): bool
    {
        return $this->type === $other->type && $this->id === $other->id;
    }
}
