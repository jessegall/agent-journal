<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use LogicException;

/**
 * A stored reader revision was about to change; a revision is never updated, a new one is written instead.
 */
final class ReaderRevisionImmutable extends LogicException
{
    public static function forRevision(string $id): self
    {
        return new self("Reader revision {$id} is never updated; write a new revision.");
    }
}
