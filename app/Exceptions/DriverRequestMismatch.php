<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

final class DriverRequestMismatch extends RuntimeException
{
    public static function for(string $key, string $requested): self
    {
        return new self(sprintf('The %s driver was handed a start for %s.', $key, $requested));
    }

    public static function notResume(string $key): self
    {
        return new self(sprintf('The %s driver was asked to resume a start that resumes no conversation.', $key));
    }
}
