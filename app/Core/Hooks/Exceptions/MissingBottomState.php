<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

final class MissingBottomState extends LogicException
{
    public static function for(string $hookMethod): self
    {
        return new self("The stack has no bottom state to answer {$hookMethod}.");
    }
}
