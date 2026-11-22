<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

/**
 * A signed call declared in a way the client cannot send safely; the boot stops on it.
 */
final class EndpointDeclarationInvalid extends LogicException
{
    /**
     * @param  class-string  $call
     */
    public static function for(string $call, string $problem): self
    {
        return new self("{$call} is not a valid signed call: {$problem}.");
    }
}
