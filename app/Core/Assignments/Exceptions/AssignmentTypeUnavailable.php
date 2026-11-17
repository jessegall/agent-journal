<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Assignments\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

final class AssignmentTypeUnavailable extends RuntimeException
{
    use RendersRefusal;

    public static function forType(string $type): self
    {
        return new self("Records of type {$type} cannot be assigned here.");
    }

    public static function forKind(ActorKind $kind): self
    {
        return new self("An actor of kind {$kind->value} cannot hold records here.");
    }

    protected function status(): int
    {
        return 404;
    }
}
