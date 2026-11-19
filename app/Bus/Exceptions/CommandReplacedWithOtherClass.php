<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use RuntimeException;

final class CommandReplacedWithOtherClass extends RuntimeException
{
    public static function for(string $command, string $replacement): self
    {
        return new self(
            "A middleware replaced {$command} with {$replacement}; a replacement is a changed copy of the same class.",
        );
    }
}
