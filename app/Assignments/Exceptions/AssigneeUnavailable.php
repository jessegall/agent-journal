<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Exceptions\Concerns\RendersRefusal;
use RuntimeException;
use Throwable;

final class AssigneeUnavailable extends RuntimeException
{
    use RendersRefusal;

    public static function forActor(ActorIdentity $actor, Throwable|null $previous = null): self
    {
        return new self("The {$actor->type->value} {$actor->id} cannot receive work now.", 0, $previous);
    }

    protected function status(): int
    {
        return 422;
    }
}
