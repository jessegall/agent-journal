<?php

declare(strict_types=1);

namespace App\Sessions\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * An execution policy that names no image for its container.
 */
final class ExecutionPolicyInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function imageMissing(): self
    {
        return new self('A required container names its verified image.');
    }
}
