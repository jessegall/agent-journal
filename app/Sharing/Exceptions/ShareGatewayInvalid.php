<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use LogicException;

/**
 * A share gateway was registered twice under one key, or with a class that is no share gateway.
 */
final class ShareGatewayInvalid extends LogicException
{
    public static function repeated(string $key): self
    {
        return new self("A share gateway is already registered under {$key}.");
    }

    public static function notAGateway(string $key, string $class): self
    {
        return new self("{$class}, registered as the share gateway {$key}, is no share gateway.");
    }
}
