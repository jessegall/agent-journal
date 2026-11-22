<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

final class CommandDeclarationInvalid extends RuntimeException
{
    public static function for(string $class, string $problem): self
    {
        return new self("{$class} is not a valid command or handler: {$problem}.");
    }

    public static function ruleUnreadable(string $class, string $property, Throwable $failure): self
    {
        $problem = "{$property} has a validation attribute that cannot be turned into a rule: {$failure->getMessage()}";

        return new self("{$class} is not a valid command or handler: {$problem}.", previous: $failure);
    }

    public static function exportedButNotRegistered(string $owner, string $command): self
    {
        return new self(
            sprintf(
                '%s exports the command %s but does not register it; register it in its commands, or stop exporting it.',
                $owner,
                $command,
            ),
        );
    }
}
