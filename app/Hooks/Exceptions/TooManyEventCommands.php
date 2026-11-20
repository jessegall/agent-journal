<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use LogicException;

final class TooManyEventCommands extends LogicException
{
    public static function count(int $count, int $most): self
    {
        return new self("An event listener returned {$count} commands. It can return at most {$most}.");
    }
}
