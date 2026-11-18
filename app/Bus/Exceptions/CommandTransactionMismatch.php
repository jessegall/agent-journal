<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandTransactionMismatch extends RuntimeException
{
    public static function for(string $command, string $problem): self
    {
        return new self("The command {$command} cannot join the open transaction: {$problem}.");
    }
}
