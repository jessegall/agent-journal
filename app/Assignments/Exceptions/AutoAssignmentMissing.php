<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Assignments\Support\AutoAssignmentKey;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A change of an auto-assignment that was never enabled; it is enabled first.
 */
final class AutoAssignmentMissing extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forKey(AutoAssignmentKey $key): self
    {
        return new self(
            "The {$key->actor->type->value} {$key->actor->id} has no auto-assignment of {$key->assignableType}; "
            .'enable it first.',
        );
    }

    protected function status(): int
    {
        return 404;
    }
}
