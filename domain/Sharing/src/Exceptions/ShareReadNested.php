<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use LogicException;

/**
 * A public read ran inside another command or an open transaction; it runs only as the one top-level command of its
 * request.
 */
final class ShareReadNested extends LogicException
{
    public static function insideAnother(): self
    {
        return new self('A share read runs only as the top-level command of its request.');
    }
}
