<?php

declare(strict_types=1);

namespace App\Core\Bus\Exceptions;

use RuntimeException;

final class CommandHandlerTwice extends RuntimeException
{
    public static function for(string $command): self
    {
        return new self("The command {$command} names its handler more than once; one #[HandledBy] only.");
    }
}
