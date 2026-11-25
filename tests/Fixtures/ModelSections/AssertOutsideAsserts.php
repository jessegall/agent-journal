<?php

declare(strict_types=1);

namespace Tests\Fixtures\ModelSections;

use Illuminate\Database\Eloquent\Model;
use RuntimeException;

/**
 * A model whose assert method sits under Internals, and whose Asserts section holds a method that is no assert.
 */
final class AssertOutsideAsserts extends Model
{
    // ----------[ Asserts ]----------

    private function isOpen(): bool
    {
        return true;
    }

    // ----------[ Internals ]----------

    private function assertOpen(): void
    {
        if (! $this->isOpen()) {
            throw new RuntimeException('closed');
        }
    }
}
