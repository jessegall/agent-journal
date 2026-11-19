<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
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
