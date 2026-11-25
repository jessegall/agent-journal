<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelThrows;

use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * A model that refuses inline in a mutation, which the model throws scan lists.
 */
final class ThrowsOutsideAnAssert extends Model
{
    // ----------[ Mutations ]----------

    public function close(): void
    {
        if ($this->getAttribute('closed_at') !== null) {
            throw new RuntimeException('closed');
        }
    }
}
