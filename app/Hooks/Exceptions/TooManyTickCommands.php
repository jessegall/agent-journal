<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class TooManyTickCommands extends LogicException
{
    public static function count(int $count, int $most): self
    {
        return new self("A tick answers at most {$most} commands, not {$count}.");
    }
}
