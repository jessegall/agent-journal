<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

final class InvalidAssignmentIdentity extends InvalidArgumentException implements CommandRefusal
{
    use RendersRefusal;

    public static function forReference(string $id): self
    {
        return new self("An assignment reference is a ULID; {$id} is not one.");
    }

    protected function status(): int
    {
        return 422;
    }
}
