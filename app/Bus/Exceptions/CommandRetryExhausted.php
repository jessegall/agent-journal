<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandRetryExhausted extends RuntimeException
{
    public static function for(string $command, int $attempts): self
    {
        return new self(
            sprintf(
                'The command %s kept meeting conflicting work and gave up after %s attempts; try it again.',
                $command,
                $attempts,
            ),
        );
    }
}
