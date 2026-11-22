<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A stored auto-assignment whose pool column does not read as a pool reference: it fails rather than stand in for
 * any pool.
 */
final class AutoAssignmentPoolUnreadable extends RuntimeException
{
    public static function forRow(string $id, Throwable $failure): self
    {
        return new self("The pool of auto-assignment {$id} cannot be read; configure it again.", 0, $failure);
    }
}
