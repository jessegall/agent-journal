<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use InvalidArgumentException;

final class InvalidAssignmentIdentity extends InvalidArgumentException
{
    public static function forType(string $type): self
    {
        return new self("A record type is a link alias such as tasks.task; \"{$type}\" is not one.");
    }

    public static function forId(string $type, int $id): self
    {
        return new self("A {$type} id is a positive whole number; {$id} is not one.");
    }

    public static function forReference(int $id): self
    {
        return new self("An assignment reference is a positive whole number; {$id} is not one.");
    }
}
