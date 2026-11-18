<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Assignments\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

final class InvalidAssignmentIdentity extends InvalidArgumentException implements CommandRefusal
{
    use RendersRefusal;

    public static function forType(string $type): self
    {
        return new self("A record type is a link alias such as tasks.task; \"{$type}\" is not one.");
    }

    public static function forId(string $type, string $id): self
    {
        return new self("A {$type} id is a ULID; {$id} is not one.");
    }

    public static function forReference(string $id): self
    {
        return new self("An assignment reference is a ULID; {$id} is not one.");
    }

    protected function status(): int
    {
        return 422;
    }
}
