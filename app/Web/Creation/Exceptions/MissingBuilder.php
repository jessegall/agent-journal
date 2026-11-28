<?php

declare(strict_types=1);

namespace App\Web\Creation\Exceptions;

use LogicException;

final class MissingBuilder extends LogicException
{
    public static function forType(string $surface, string $type): self
    {
        return new self("No {$surface} builder registered for {$type}");
    }
}
