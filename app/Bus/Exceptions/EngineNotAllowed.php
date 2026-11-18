<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class EngineNotAllowed extends RuntimeException
{
    public static function forCommand(string $command): self
    {
        return new self("The engine may not run {$command}: the command does not declare AllowsEngine.");
    }
}
