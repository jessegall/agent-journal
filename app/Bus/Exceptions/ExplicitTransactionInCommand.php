<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class ExplicitTransactionInCommand extends RuntimeException
{
    public static function for(string $command): self
    {
        return new self(
            "A transaction was opened while {$command} ran; the bus opens the transaction, so take that call out.",
        );
    }
}
