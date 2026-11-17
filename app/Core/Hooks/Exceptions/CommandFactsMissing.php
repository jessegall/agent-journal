<?php

declare(strict_types=1);

namespace App\Core\Hooks\Exceptions;

use LogicException;

/**
 * No domain supplies the parser that reads shell commands, so no shell command can be judged.
 */
final class CommandFactsMissing extends LogicException
{
    public static function forLine(): self
    {
        return new self('No shell command parser is bound; the Processes domain supplies it.');
    }
}
