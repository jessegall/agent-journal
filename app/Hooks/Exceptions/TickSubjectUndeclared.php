<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

final class TickSubjectUndeclared extends RuntimeException
{
    /**
     * @param  class-string  $command
     */
    public static function forCommand(string $command): self
    {
        return new self("{$command} runs inside a tick command and locks work that command did not declare.");
    }
}
