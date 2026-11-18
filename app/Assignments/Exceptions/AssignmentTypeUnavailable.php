<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use App\Actors\Enums\ActorType;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class AssignmentTypeUnavailable extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forType(string $type): self
    {
        return new self("Records of type {$type} cannot be assigned here.");
    }

    public static function forActorType(ActorType $type): self
    {
        return new self("An actor of type {$type->value} cannot hold records here.");
    }

    protected function status(): int
    {
        return 404;
    }
}
