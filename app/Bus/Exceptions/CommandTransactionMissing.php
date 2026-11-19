<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

/**
 * Work that must run inside a bus command's transaction ran outside one.
 */
final class CommandTransactionMissing extends RuntimeException
{
    public static function for(string $connection): self
    {
        return new self(
            "No bus command transaction is running on the {$connection} connection; run this work through a command.",
        );
    }
}
