<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use InvalidArgumentException;
use Throwable;

final class SupervisorRouteInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function missingDefault(): self
    {
        return new self('A supervisor map needs a default target.');
    }

    public static function askType(string $type): self
    {
        return new self("No ask type named {$type} is registered.");
    }

    public static function target(string $target, Throwable|null $cause = null): self
    {
        return new self("The supervisor target {$target} is invalid.", previous: $cause);
    }

    public static function unknownProfile(string $target): self
    {
        return new self("The supervisor target {$target} is not an activated or proposed profile.");
    }
}
