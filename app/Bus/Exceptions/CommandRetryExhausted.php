<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandRetryExhausted extends RuntimeException
{
    public static function for(string $command, int $attempts): self
    {
        return new self("The command {$command} kept meeting conflicting work and gave up after {$attempts} attempts; try it again.");
    }
}
