<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * Start-up stops: a service every shell command depends on has no binding, so no command could be admitted safely.
 */
final class ProcessesServiceMissing extends LogicException
{
    public static function for(string $service): self
    {
        return new self("The processes service {$service} is not bound; the journal cannot admit any shell command.");
    }
}
