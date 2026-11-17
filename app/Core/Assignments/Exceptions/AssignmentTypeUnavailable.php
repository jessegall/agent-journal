<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Actors\Enums\ActorKind;
use RuntimeException;

final class AssignmentTypeUnavailable extends RuntimeException
{
    public static function forType(string $type): self
    {
        return new self("Records of type {$type} cannot be assigned here.");
    }

    public static function forKind(ActorKind $kind): self
    {
        return new self("An actor of kind {$kind->value} cannot hold records here.");
    }
}
