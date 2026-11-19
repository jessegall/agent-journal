<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

final class AssigneeUnavailable extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forActor(AssigneeIdentity $actor, Throwable|null $previous = null): self
    {
        return new self("The {$actor->type} {$actor->id} cannot receive work now.", 0, $previous);
    }

    protected function status(): int
    {
        return 422;
    }
}
