<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

/**
 * The journal answered a hook call successfully but its body is not a program reply.
 */
final class ProgramReplyMalformed extends RuntimeException
{
    public static function missing(string $field): self
    {
        return new self("The journal's hook reply has no {$field}.");
    }
}
