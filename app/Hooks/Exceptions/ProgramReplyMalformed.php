<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;
use Throwable;

/**
 * The journal answered a hook call successfully but its body is not a program reply.
 */
final class ProgramReplyMalformed extends RuntimeException
{
    public static function because(Throwable $cause): self
    {
        return new self("The journal's hook reply is not a standard output, standard error and exit code.", 0, $cause);
    }
}
