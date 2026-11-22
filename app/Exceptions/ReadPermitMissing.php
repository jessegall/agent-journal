<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A read named a permit this request never issued, or one already taken: only the public bridge issues permits, and
 * each is taken once.
 */
final class ReadPermitMissing extends LogicException
{
    public static function forReference(string $reference): self
    {
        return new self("No read permit {$reference} is held in this request.");
    }

    public static function serialized(): self
    {
        return new self('A read permit lives in its request only and is never serialized.');
    }
}
