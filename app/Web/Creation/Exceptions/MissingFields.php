<?php

declare(strict_types=1);

namespace App\Web\Creation\Exceptions;

use LogicException;

final class MissingFields extends LogicException
{
    public static function forType(string $type, string ...$fields): self
    {
        return new self($type.' requires '.implode(', ', $fields));
    }
}
