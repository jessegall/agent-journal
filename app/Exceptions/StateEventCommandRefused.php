<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class StateEventCommandRefused extends LogicException
{
    public static function for(string $command): self
    {
        return new self("A state event listener can return application commands. {$command} uses a trusted entry.");
    }
}
