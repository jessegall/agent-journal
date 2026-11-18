<?php

declare(strict_types=1);

namespace App\Core\Bus\Exceptions;

use RuntimeException;

final class CommandNestingTooDeep extends RuntimeException
{
    public static function at(int $depth): self
    {
        return new self("Commands dispatched from handlers nest {$depth} deep; dispatch fewer commands from inside one.");
    }
}
