<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Actors\Support\ActorIdentity;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

final class AssignmentDenied extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forCaller(ActorIdentity $caller, Throwable|null $previous = null): self
    {
        return new self("Only the owner or a main agent may give out work; {$caller->type->value} {$caller->id} may not.", 0, $previous);
    }

    protected function status(): int
    {
        return 403;
    }
}
