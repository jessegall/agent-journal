<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Actors\Support\ActorIdentity;
use RuntimeException;
use Throwable;

final class AssigneeUnavailable extends RuntimeException
{
    public static function forActor(ActorIdentity $actor, Throwable|null $previous = null): self
    {
        return new self("The {$actor->kind->value} {$actor->id} cannot receive work now.", 0, $previous);
    }
}
